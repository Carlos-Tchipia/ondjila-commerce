<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\User;
use App\Repositories\UserRepository;

class AuthService
{
    private UserRepository $users;
    private EmailValidationService $emailValidation;
    private TransactionalEmailService $emails;

    public function __construct()
    {
        $this->users = new UserRepository();
        $this->emailValidation = new EmailValidationService();
        $this->emails = new TransactionalEmailService();
    }

    public function register(array $data): array
    {
        $errors = $this->validateRegister($data);
        if ($errors !== []) {
            return ['success' => false, 'errors' => $errors];
        }

        $email = strtolower(trim((string) $data['email']));
        if ($this->users->emailExists($email)) {
            return ['success' => false, 'errors' => ['email' => 'Este email ja esta registado.']];
        }

        $emailCheck = $this->emailValidation->validate($email);
        if (!$emailCheck['valid']) {
            return ['success' => false, 'errors' => ['email' => $emailCheck['reason'] ?? 'Email invalido.']];
        }

        $user = new User(
            id:       null,
            name:     trim((string) $data['name']),
            email:    $email,
            password: password_hash((string) $data['password'], PASSWORD_DEFAULT),
            role:     'customer',
            phone:    $data['phone'] ?? null,
            address:  $data['address'] ?? null,
        );

        $userId = $this->users->create($user);
        $user = $this->users->findById($userId);

        if ($user === null) {
            return ['success' => false, 'message' => 'Conta criada, mas nao foi possivel carregar o utilizador.'];
        }

        $token = generateJwt([
            'sub'   => $userId,
            'email' => $user->email,
            'role'  => $user->role,
        ]);

        $this->emails->sendWelcome($user->email, $user->name);

        return [
            'success' => true,
            'token'   => $token,
            'user'    => $user->toArray(),
        ];
    }

    public function login(array $data): array
    {
        $email    = strtolower(trim((string) ($data['email'] ?? '')));
        $password = (string) ($data['password'] ?? '');

        if ($email === '' || $password === '') {
            return ['success' => false, 'message' => 'Email e senha sao obrigatorios.'];
        }

        $user = $this->users->findByEmail($email);

        if ($user === null || !password_verify($password, $user->password)) {
            return ['success' => false, 'message' => 'Credenciais invalidas.'];
        }

        $token = generateJwt([
            'sub'   => $user->id,
            'email' => $user->email,
            'role'  => $user->role,
        ]);

        return [
            'success' => true,
            'token'   => $token,
            'user'    => $user->toArray(),
        ];
    }

    public function forgotPassword(string $email): array
    {
        $email = strtolower(trim($email));
        if ($email === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
            return ['success' => false, 'message' => 'Email invalido.'];
        }

        $genericMessage = 'Se o email existir, recebera um link de recuperacao.';
        $user = $this->users->findByEmail($email);
        if ($user === null) {
            return ['success' => true, 'message' => $genericMessage];
        }

        $token = bin2hex(random_bytes(32));
        $expires = date('Y-m-d H:i:s', strtotime('+1 hour'));
        $db = \App\Config\Database::getConnection();

        $stmt = $db->prepare('DELETE FROM password_resets WHERE email = :email');
        $stmt->execute([':email' => $email]);

        $stmt = $db->prepare('INSERT INTO password_resets (email, token, expires_at) VALUES (:email, :token, :expires)');
        $stmt->execute([
            ':email' => $email,
            ':token' => $token,
            ':expires' => $expires,
        ]);

        $resetUrl = $this->buildPasswordResetUrl($user->email, $token);
        $sent = $this->emails->sendPasswordReset($user->email, $user->name, $resetUrl);

        if (!$sent) {
            return ['success' => false, 'message' => 'Erro ao enviar o email de recuperacao. Tente novamente mais tarde.'];
        }

        if (!$this->emails->hasRealProvider()) {
            return [
                'success' => true,
                'message' => "Modo desenvolvimento: use este link para repor a palavra-passe: {$resetUrl}",
                'reset_url' => $resetUrl,
            ];
        }

        return ['success' => true, 'message' => $genericMessage];
    }

    public function resetPassword(string $email, string $token, string $newPassword): array
    {
        $email = strtolower(trim($email));

        if (!filter_var($email, FILTER_VALIDATE_EMAIL) || trim($token) === '') {
            return ['success' => false, 'message' => 'Link de recuperacao invalido ou expirado.'];
        }

        if (strlen($newPassword) < 6) {
            return ['success' => false, 'message' => 'A senha deve ter pelo menos 6 caracteres.'];
        }

        $db = \App\Config\Database::getConnection();
        $stmt = $db->prepare('SELECT * FROM password_resets WHERE email = :email AND token = :token AND expires_at > NOW()');
        $stmt->execute([':email' => $email, ':token' => $token]);
        $resetRecord = $stmt->fetch();

        if (!$resetRecord) {
            return ['success' => false, 'message' => 'Link de recuperacao invalido ou expirado.'];
        }

        $user = $this->users->findByEmail($email);
        if ($user === null) {
            return ['success' => false, 'message' => 'Utilizador nao encontrado.'];
        }

        $hashedPassword = password_hash($newPassword, PASSWORD_DEFAULT);
        $stmt = $db->prepare('UPDATE users SET password = :password WHERE email = :email');
        $stmt->execute([':password' => $hashedPassword, ':email' => $email]);

        $stmt = $db->prepare('DELETE FROM password_resets WHERE email = :email');
        $stmt->execute([':email' => $email]);

        return ['success' => true, 'message' => 'Palavra-passe alterada com sucesso! Ja pode iniciar sessao.'];
    }

    private function validateRegister(array $data): array
    {
        $errors = [];

        if (empty($data['name']) || strlen(trim((string) $data['name'])) < 2) {
            $errors['name'] = 'O nome deve ter pelo menos 2 caracteres.';
        }
        if (empty($data['email']) || !filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
            $errors['email'] = 'Email invalido.';
        }
        if (empty($data['password']) || strlen((string) $data['password']) < 6) {
            $errors['password'] = 'A senha deve ter pelo menos 6 caracteres.';
        }
        if (($data['password'] ?? '') !== ($data['password_confirmation'] ?? '')) {
            $errors['password_confirmation'] = 'As senhas nao coincidem.';
        }

        return $errors;
    }

    private function buildPasswordResetUrl(string $email, string $token): string
    {
        $frontendUrl = rtrim((string) ($_ENV['FRONTEND_URL'] ?? $_ENV['APP_FRONTEND_URL'] ?? 'http://localhost:4200'), '/');
        return $frontendUrl . '/reset-password?token=' . urlencode($token) . '&email=' . urlencode($email);
    }
}
