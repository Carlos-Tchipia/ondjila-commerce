<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\User;
use App\Repositories\UserRepository;

class AuthService
{
    private UserRepository $users;

    public function __construct()
    {
        $this->users = new UserRepository();
    }

    public function register(array $data): array
    {
        // Validação
        $errors = $this->validateRegister($data);
        if (!empty($errors)) {
            return ['success' => false, 'errors' => $errors];
        }

        if ($this->users->emailExists($data['email'])) {
            return ['success' => false, 'errors' => ['email' => 'Este email já está registado.']];
        }

        $user = new User(
            id:       null,
            name:     trim($data['name']),
            email:    strtolower(trim($data['email'])),
            password: password_hash($data['password'], PASSWORD_BCRYPT),
            role:     'customer',
            phone:    $data['phone'] ?? null,
            address:  $data['address'] ?? null,
        );

        $userId = $this->users->create($user);
        $user = $this->users->findById($userId);

        $token = generateJwt([
            'sub'   => $userId,
            'email' => $user->email,
            'role'  => $user->role,
        ]);

        return [
            'success' => true,
            'token'   => $token,
            'user'    => $user->toArray(),
        ];
    }

    public function login(array $data): array
    {
        $email    = strtolower(trim($data['email'] ?? ''));
        $password = $data['password'] ?? '';

        if (empty($email) || empty($password)) {
            return ['success' => false, 'message' => 'Email e senha são obrigatórios.'];
        }

        $user = $this->users->findByEmail($email);

        if ($user === null || !password_verify($password, $user->password)) {
            return ['success' => false, 'message' => 'Credenciais inválidas.'];
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

    private function validateRegister(array $data): array
    {
        $errors = [];

        if (empty($data['name']) || strlen($data['name']) < 2) {
            $errors['name'] = 'O nome deve ter pelo menos 2 caracteres.';
        }
        if (empty($data['email']) || !filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
            $errors['email'] = 'Email inválido.';
        }
        if (empty($data['password']) || strlen($data['password']) < 6) {
            $errors['password'] = 'A senha deve ter pelo menos 6 caracteres.';
        }
        if (($data['password'] ?? '') !== ($data['password_confirmation'] ?? '')) {
            $errors['password_confirmation'] = 'As senhas não coincidem.';
        }

        return $errors;
    }

    public function forgotPassword(string $email): array
    {
        $email = strtolower(trim($email));
        if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
            return ['success' => false, 'message' => 'Email inválido.'];
        }

        $user = $this->users->findByEmail($email);
        if ($user === null) {
            // Retornamos sucesso mesmo se não existir para evitar enumeração de emails
            return ['success' => true, 'message' => 'Se o email existir, receberá um link de recuperação.'];
        }

        $token = bin2hex(random_bytes(32));
        $expires = date('Y-m-d H:i:s', strtotime('+1 hour'));

        $db = \App\Config\Database::getConnection();
        
        // Limpar tokens antigos
        $stmt = $db->prepare("DELETE FROM password_resets WHERE email = :email");
        $stmt->execute([':email' => $email]);

        // Inserir novo
        $stmt = $db->prepare("INSERT INTO password_resets (email, token, expires_at) VALUES (:email, :token, :expires)");
        $stmt->execute([
            ':email' => $email,
            ':token' => $token,
            ':expires' => $expires
        ]);

        $mail = new \App\Helpers\MailHelper();
        $sent = $mail->sendPasswordResetEmail($user->email, $user->name, $token);

        if (!$sent) {
            return ['success' => false, 'message' => 'Erro ao enviar o e-mail de recuperação. Tente novamente mais tarde.'];
        }

        return ['success' => true, 'message' => 'Se o email existir, receberá um link de recuperação.'];
    }

    public function resetPassword(string $email, string $token, string $newPassword): array
    {
        $email = strtolower(trim($email));
        
        if (strlen($newPassword) < 6) {
            return ['success' => false, 'message' => 'A senha deve ter pelo menos 6 caracteres.'];
        }

        $db = \App\Config\Database::getConnection();
        
        // Verificar token
        $stmt = $db->prepare("SELECT * FROM password_resets WHERE email = :email AND token = :token AND expires_at > NOW()");
        $stmt->execute([':email' => $email, ':token' => $token]);
        $resetRecord = $stmt->fetch();

        if (!$resetRecord) {
            return ['success' => false, 'message' => 'Link de recuperação inválido ou expirado.'];
        }

        // Atualizar senha
        $user = $this->users->findByEmail($email);
        if ($user) {
            $hashedPassword = password_hash($newPassword, PASSWORD_BCRYPT);
            $stmt = $db->prepare("UPDATE users SET password = :password WHERE email = :email");
            $stmt->execute([':password' => $hashedPassword, ':email' => $email]);
            
            // Apagar token usado
            $stmt = $db->prepare("DELETE FROM password_resets WHERE email = :email");
            $stmt->execute([':email' => $email]);

            return ['success' => true, 'message' => 'Palavra-passe alterada com sucesso! Já pode iniciar sessão.'];
        }

        return ['success' => false, 'message' => 'Utilizador não encontrado.'];
    }
}
