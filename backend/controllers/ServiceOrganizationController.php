<?php
include_once __DIR__ . '/../config/db.php';

class ServiceOrganizationController
{
    private $pdo;

    public function __construct()
    {
        global $pdo;
        $this->pdo = $pdo;
    }

    // Получение всех организаций
    public function getServiceOrganizations()
    {
        try {
            $stmt = $this->pdo->query('SELECT * FROM `Сервисные_организации`');
            return $stmt->fetchAll();
        } catch (PDOException $e) {
            error_log("Error in getServiceOrganizations: " . $e->getMessage());
            return ['error' => 'Ошибка при получении списка организаций'];
        }
    }

    // Получение организации по ID (аналог getByIdEquipment)
    public function getByIdServiceOrganization($id)
    {
        try {
            $sql = "SELECT * FROM `Сервисные_организации` WHERE `id` = :id";
            $stmt = $this->pdo->prepare($sql);
            $stmt->execute(['id' => $id]);
            return $stmt->fetchAll();
        } catch (PDOException $e) {
            error_log("Error in getByIdServiceOrganization: " . $e->getMessage());
            return ['error' => 'Ошибка при получении организации'];
        }
    }

    // Создание/обновление организации
    public function createUpdateServiceOrganization($data, $id = null)
    {
        try {
            $params = [
                'name' => $data['название_организации'],
                'postal_code' => $data['почтовый_индекс'],
                'city' => $data['город'],
                'street' => $data['улица'],
                'building' => $data['дом_корпус'],
                'phones' => $data['телефоны'],
                'email' => $data['email'] ?? null,
                'website' => $data['сайт'] ?? null,
                'contacts' => $data['контактные_лица']
            ];

            if ($id) {
                $sql = "UPDATE `Сервисные_организации` SET 
                    название_организации = :name,
                    почтовый_индекс = :postal_code,
                    город = :city,
                    улица = :street,
                    дом_корпус = :building,
                    телефоны = :phones,
                    email = :email,
                    сайт = :website,
                    контактные_лица = :contacts
                    WHERE id = :id";
                $params['id'] = $id;
            } else {
                $sql = "INSERT INTO `Сервисные_организации` (
                    название_организации,
                    почтовый_индекс,
                    город,
                    улица,
                    дом_корпус,
                    телефоны,
                    email,
                    сайт,
                    контактные_лица
                ) VALUES (
                    :name,
                    :postal_code,
                    :city,
                    :street,
                    :building,
                    :phones,
                    :email,
                    :website,
                    :contacts
                )";
            }

            $stmt = $this->pdo->prepare($sql);
            $stmt->execute($params);

            return ['success' => true, 'message' => $id ? 'Организация обновлена' : 'Организация добавлена'];
        } catch (PDOException $e) {
            error_log("Error in createUpdateServiceOrganization: " . $e->getMessage());
            return ['success' => false, 'message' => $e->getMessage()];
        }
    }

    // Удаление организации
    public function removeServiceOrganization($id)
    {
        try {
            $stmt = $this->pdo->prepare("DELETE FROM `Сервисные_организации` WHERE id = ?");
            $stmt->execute([$id]);
            return ['message' => 'Организация удалена', 'success' => true];
        } catch (PDOException $e) {
            error_log("Error in removeServiceOrganization: " . $e->getMessage());
            return ['error' => 'Ошибка при удалении организации'];
        }
    }
}
?>