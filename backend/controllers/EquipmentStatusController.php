<?php
include_once __DIR__ . '/../config/db.php';

class EquipmentStatusController
{
    private $pdo;

    public function __construct()
    {
        global $pdo;
        $this->pdo = $pdo;
    }

    public function getEquipmentStatuses()
    {
        try {
            $sql = "SELECT s.*, 
                e.название_оборудования, e.заводской_номер, e.инвентарный_номер, 
                e.дата_ввода_в_эксплуатацию, o.название_организации as сервисная_организация
                FROM `Статусы_оборудования` s
                LEFT JOIN `Оборудование` e ON s.equipment_id = e.id
                LEFT JOIN `Сервисные_организации` o ON s.service_org_id = o.id";
            $stmt = $this->pdo->query($sql);
            return $stmt->fetchAll();
        } catch (PDOException $e) {
            error_log("Error in getEquipmentStatuses: " . $e->getMessage());
            return ['error' => 'Ошибка при получении статусов'];
        }
    }

    public function getByIdEquipmentStatus($id)
    {
        try {
            $sql = "SELECT s.*, e.заводской_номер, e.инвентарный_номер, e.дата_ввода_в_эксплуатацию
                   FROM `Статусы_оборудования` s
                   LEFT JOIN `Оборудование` e ON s.equipment_id = e.id
                   WHERE s.id = :id";
            $stmt = $this->pdo->prepare($sql);
            $stmt->execute(['id' => $id]);
            return $stmt->fetchAll();
        } catch (PDOException $e) {
            error_log("Error in getByIdEquipmentStatus: " . $e->getMessage());
            return ['error' => 'Ошибка при получении статуса'];
        }
    }

    public function createUpdateEquipmentStatus($data, $id = null)
    {
        try {
            // Подготовка данных с проверкой на пустые значения
            $params = [
                'equipment_id' => $data['equipment_id'],
                'status_type' => $data['status_type'],
                'status_date' => $data['status_date'],
                'notes' => $data['notes'] ?? null,
                'service_org_id' => !empty($data['service_org_id']) ? $data['service_org_id'] : null,
                'received_by' => $data['received_by'] ?? null,
                'transferred_by' => $data['transferred_by'] ?? null,
                'defect_act' => $data['defect_act'] ?? null,
                'serial_number' => $data['serial_number'] ?? null,
                'inventory_number' => $data['inventory_number'] ?? null,
                'commissioning_date' => $data['commissioning_date'] ?? null
            ];

            if ($id) {
                $sql = "UPDATE `Статусы_оборудования` SET 
                    equipment_id = :equipment_id,
                    status_type = :status_type,
                    status_date = :status_date,
                    notes = :notes,
                    service_org_id = :service_org_id,
                    received_by = :received_by,
                    transferred_by = :transferred_by,
                    defect_act = :defect_act,
                    serial_number = :serial_number,
                    inventory_number = :inventory_number,
                    commissioning_date = :commissioning_date
                    WHERE id = :id";
                $params['id'] = $id;
            } else {
                $sql = "INSERT INTO `Статусы_оборудования` (
                    equipment_id, status_type, status_date, notes,
                    service_org_id, received_by, transferred_by, defect_act,
                    serial_number, inventory_number, commissioning_date
                ) VALUES (
                    :equipment_id, :status_type, :status_date, :notes,
                    :service_org_id, :received_by, :transferred_by, :defect_act,
                    :serial_number, :inventory_number, :commissioning_date
                )";
            }

            $stmt = $this->pdo->prepare($sql);
            $stmt->execute($params);

            return ['success' => true, 'message' => $id ? 'Статус обновлен' : 'Статус добавлен'];
        } catch (PDOException $e) {
            error_log("Error in createUpdateEquipmentStatus: " . $e->getMessage());
            return ['success' => false, 'message' => $e->getMessage()];
        }
    }

    public function getEquipmentInfo($equipmentId)
    {
        try {
            $sql = "SELECT заводской_номер, инвентарный_номер, дата_ввода_в_эксплуатацию 
                    FROM `Оборудование` WHERE id = :id";
            $stmt = $this->pdo->prepare($sql);
            $stmt->execute(['id' => $equipmentId]);
            return $stmt->fetch();
        } catch (PDOException $e) {
            error_log("Error in getEquipmentInfo: " . $e->getMessage());
            return null;
        }
    }
    public function removeEquipmentStatus($id)
    {
        try {
            $stmt = $this->pdo->prepare("DELETE FROM `Статусы_оборудования` WHERE id = ?");
            $stmt->execute([$id]);
            return ['message' => 'Статус удален', 'success' => true];
        } catch (PDOException $e) {
            error_log("Error in removeServiceOrganization: " . $e->getMessage());
            return ['error' => 'Ошибка при удалении статуса оборудования'];
        }
    }
}
?>