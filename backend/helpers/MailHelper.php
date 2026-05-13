<?php
declare(strict_types=1);

namespace App\Helpers;

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

class MailHelper
{
    private PHPMailer $mail;

    public function __construct()
    {
        $this->mail = new PHPMailer(true);

        try {
            // Server settings
            $this->mail->isSMTP();
            $this->mail->Host       = $_ENV['MAIL_HOST'] ?? 'sandbox.smtp.mailtrap.io';
            $this->mail->SMTPAuth   = true;
            $this->mail->Username   = $_ENV['MAIL_USERNAME'] ?? ''; // Configurar no .env
            $this->mail->Password   = $_ENV['MAIL_PASSWORD'] ?? ''; // Configurar no .env
            $this->mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
            $this->mail->Port       = (int)($_ENV['MAIL_PORT'] ?? 2525);

            // Defaults
            $this->mail->setFrom('noreply@ondjila.ao', 'Ondjila Commerce');
            $this->mail->isHTML(true);
            $this->mail->CharSet = 'UTF-8';
        } catch (Exception $e) {
            error_log("Erro ao configurar PHPMailer: {$e->getMessage()}");
        }
    }

    public function sendPasswordResetEmail(string $toEmail, string $toName, string $token): bool
    {
        try {
            $this->mail->clearAddresses();
            $this->mail->addAddress($toEmail, $toName);

            $resetUrl = "http://localhost:4200/reset-password?token={$token}&email=" . urlencode($toEmail);

            $this->mail->Subject = 'Recuperação de Palavra-passe - Ondjila Commerce';
            
            $html = "
                <div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;'>
                    <h2 style='color: #C8960C; text-align: center; text-transform: uppercase; letter-spacing: 2px;'>Ondjila Commerce</h2>
                    <p>Olá {$toName},</p>
                    <p>Recebemos um pedido para repor a sua palavra-passe.</p>
                    <div style='text-align: center; margin: 30px 0;'>
                        <a href='{$resetUrl}' style='background-color: #C8960C; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px;'>Repor Palavra-passe</a>
                    </div>
                    <p style='font-size: 12px; color: #666;'>Se não pediu a reposição, pode ignorar este e-mail.</p>
                    <p style='font-size: 12px; color: #666;'>O link expira em 1 hora.</p>
                </div>
            ";
            
            $this->mail->Body    = $html;
            $this->mail->AltBody = "Olá {$toName},\n\nPara repor a sua senha, visite este link: {$resetUrl}\n\nO link expira em 1 hora.";

            $this->mail->send();
            return true;
        } catch (Exception $e) {
            error_log("Erro ao enviar email de reset: {$this->mail->ErrorInfo}");
            return false;
        }
    }
}
