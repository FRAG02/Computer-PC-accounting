<?php

include_once __DIR__ . '/../config/db.php';

class EquipmentController
{
    private $pdo;

    public function __construct()
    {
        global $pdo;
        $this->pdo = $pdo;
    }

    public function getEquipment()
    {
        $stmt = $this->pdo->query('SELECT Оборудование.*, Подразделения.название_подразделения FROM Оборудование INNER JOIN Подразделения ON Оборудование.подразделение_id = Подразделения.id');
        return $stmt->fetchAll();
    }
    public function getByIdEquipment($id)
    {
        try {
            $sql = "
                SELECT 
                    `Оборудование`.*, 
                    `Подразделения`.`название_подразделения`
                FROM 
                    `Оборудование`
                INNER JOIN 
                    `Подразделения` ON `Оборудование`.`подразделение_id` = `Подразделения`.`id`
                WHERE 
                    `Оборудование`.`id` = :id
            ";
            $stmt = $this->pdo->prepare($sql);
            $stmt->execute(['id' => $id]);
            return $stmt->fetchAll();
        } catch (PDOException $e) {
            error_log("Error in getByIdEquipment: " . $e->getMessage()); // Логируем ошибку
            return ['error' => 'Ошибка при выполнении запроса'];
        }
    }

    public function removeEquipment($id)
    {
        $stmt = $this->pdo->prepare("DELETE FROM Оборудование WHERE id = ?");
        $stmt->execute([$id]);
        return ['message' => 'Оборудование удалено', 'success' => true];
    }

    public function createUpdateEquipment($data, $id = null)
    {
        try {

            $params = [
                'name' => $data['название_оборудования'],
                'production_date' => $data['дата_производства'],
                'receipt_date' => $data['дата_поступления'],
                'commissioning_date' => $data['дата_ввода_в_эксплуатацию'],
                'decommissioning_date' => $data['дата_вывода_из_эксплуатации'],
                'cost' => $data['стоимость'],
                'serial_number' => $data['заводской_номер'],
                'inventory_number' => $data['инвентарный_номер'],
                'department_id' => $data['подразделение_id'],
                'office_number' => $data['номер_кабинета']
            ];

            // Проверяем, существует ли оборудование с указанным id
            if ($id) {
                // Обновляем существующее оборудование
                $sql = "
                UPDATE `Оборудование`
                SET 
                    `название_оборудования` = :name,
                    `дата_производства` = :production_date,
                    `дата_поступления` = :receipt_date,
                    `дата_ввода_в_эксплуатацию` = :commissioning_date,
                    `дата_вывода_из_эксплуатации` = :decommissioning_date,
                    `стоимость` = :cost,
                    `заводской_номер` = :serial_number,
                    `инвентарный_номер` = :inventory_number,
                    `подразделение_id` = :department_id,
                    `номер_кабинета` = :office_number
                WHERE 
                    `id` = :id
            ";
                $params['id'] = $data['id'];
                $stmt = $this->pdo->prepare($sql);
                $stmt->execute($params);
                return ['success' => true, 'message' => 'Оборудование успешно обновлено'];
            } else {
                // Добавляем новое оборудование

                $sql = "
                INSERT INTO `Оборудование` (
                    `название_оборудования`,
                    `дата_производства`,
                    `дата_поступления`,
                    `дата_ввода_в_эксплуатацию`,
                    `дата_вывода_из_эксплуатации`,
                    `стоимость`,
                    `заводской_номер`,
                    `инвентарный_номер`,
                    `подразделение_id`,
                    `номер_кабинета`  
                ) VALUES (
                    :name,
                    :production_date,
                    :receipt_date,
                    :commissioning_date,
                    :decommissioning_date,
                    :cost,
                    :serial_number,
                    :inventory_number,
                    :department_id,
                    :office_number
                )
            ";
                $stmt = $this->pdo->prepare($sql);
                $stmt->execute($params);
                return ['success' => true, 'message' => 'Оборудование успешно добавлено'];
            }
        } catch (PDOException $e) {
            error_log("Error in saveOrUpdateEquipment: " . $e->getMessage()); // Логируем ошибку
            return ['success' => false, 'message' => $e->getMessage()];
        }
    }
}