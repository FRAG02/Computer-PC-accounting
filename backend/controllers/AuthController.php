<?php

require_once __DIR__ . '/../config/db.php';



class AuthController
{
    private $pdo;

    public function __construct()
    {
        require_once __DIR__ . '/../config/db.php';
        global $pdo; // Объявляем переменную как глобальную
        $this->pdo = $pdo; // Теперь $pdo доступен внутри класса
    }

    public function login($data)
    {
        try {
            // Используем BINARY для регистрозависимого сравнения
            $stmt = $this->pdo->prepare("SELECT * FROM Пользователи WHERE BINARY username = ?");
            $stmt->execute([$data['username']]);
            $user = $stmt->fetch(PDO::FETCH_ASSOC);

            if (!$user) {
                // Если пользователь не найден
                http_response_code(401);
                return ['success' => false, 'message' => 'Неверный логин'];
            }

            if (!password_verify($data['password'], $user['password'])) {
                // Если пароль неверный
                http_response_code(401);
                return ['success' => false, 'message' => 'Неверный пароль'];
            }

            // Если всё верно
            unset($user['password']); // Убираем пароль из ответа
            return [
                'success' => true,
                'message' => 'Успешный вход',
                'user' => $user
            ];
        } catch (Exception $e) {
            error_log("Login error: " . $e->getMessage()); // Логируем ошибку
            http_response_code(500);
            return ['success' => false, 'message' => 'Ошибка при входе в систему'];
        }
    }
    public function register($data)
    {
        try {
            // Проверка длины username
            if (strlen($data['username']) < 3) {
                return ['success' => false, 'message' => 'Логин должен содержать минимум 3 символа'];
            }

            // Проверка длины password
            if (strlen($data['password']) < 8) {
                return ['success' => false, 'message' => 'Пароль должен содержать минимум 8 символов'];
            }

            // Проверка наличия обязательных символов в пароле
            if (!preg_match('/[\$\)\?]/', $data['password'])) {
                return ['success' => false, 'message' => 'Пароль должен содержать хотя бы один из символов: $, ), ?'];
            }

            // Проверка на наличие хотя бы одной заглавной буквы
            if (!preg_match('/[A-Z]/', $data['password'])) {
                return ['success' => false, 'message' => 'Пароль должен содержать хотя бы одну заглавную букву'];
            }

            // Проверка на наличие хотя бы одной строчной буквы
            if (!preg_match('/[a-z]/', $data['password'])) {
                return ['success' => false, 'message' => 'Пароль должен содержать хотя бы одну строчную букву'];
            }

            // Ищем пользователя в базе
            $stmt = $this->pdo->prepare('SELECT id FROM Пользователи WHERE username = ?');
            $stmt->execute([$data['username']]);
            $user = $stmt->fetch();

            if ($user) {
                return ['success' => false, 'message' => 'Пользователь с таким логином уже существует'];
            }

            // Хэшируем пароль
            $hashedPassword = password_hash($data['password'], PASSWORD_BCRYPT);

            // Добавляем пользователя в базу данных
            $stmt = $this->pdo->prepare('INSERT INTO Пользователи (username, password, role) VALUES (?, ?, ?)');
            $stmt->execute([$data['username'], $hashedPassword, $data['role']]);

            return ['success' => true, 'message' => 'Пользователь успешно зарегистрирован'];
        } catch (Exception $e) {
            error_log("Registration error: " . $e->getMessage()); // Логируем исключение
            return ['success' => false, 'message' => 'Ошибка при регистрации'];
        }
    }
}

