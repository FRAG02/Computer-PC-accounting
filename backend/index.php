<?php
header("Content-Type: application/json; charset=UTF-8");

require_once __DIR__ . '/config/db.php';
require_once __DIR__ . '/controllers/AuthController.php';
require_once __DIR__ . '/controllers/DepartmentController.php';
require_once __DIR__ . '/controllers/MOLController.php';
require_once __DIR__ . '/controllers/EquipmentController.php';
require_once __DIR__ . '/controllers/ServiceOrganizationController.php';
require_once __DIR__ . '/controllers/EquipmentStatusController.php';

$requestMethod = $_SERVER['REQUEST_METHOD'];
// Получаем URI и убираем лишние символы
$requestUri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$requestUri = trim($requestUri, '/');
$requestUriParts = explode('/', $requestUri);

$endpoint = $requestUriParts[0] ?? '';
$sharedID = isset($requestUriParts[1]) ? $requestUriParts[1] : null;

$authController = new AuthController();
$departmentController = new DepartmentController();
$molController = new MOLController();
$equipmentController = new EquipmentController();
$serviceOrganizationController = new ServiceOrganizationController();
$equipmentStatusController = new EquipmentStatusController();


switch ($endpoint) {
    case 'login':
        echo json_encode($authController->login(json_decode(file_get_contents('php://input'), true)));
        break;
    case 'register':
        $username = $_POST['username'] ?? '';
        $password = $_POST['password'] ?? '';
        echo json_encode($authController->register(json_decode(file_get_contents('php://input'), true)));
        break;


    case 'mols':
        if ($requestMethod == 'POST') {
            echo json_encode($molController->createUpdateMol(json_decode(file_get_contents('php://input'), true), $sharedID));
            break;
        }
        if ($sharedID) {
            echo json_encode($molController->getByIdMOL($sharedID));
            break;
        } else {
            echo json_encode($molController->getMOLs());
            break;
        }

    case 'departments':
        if ($requestMethod == 'POST') {
            echo json_encode($departmentController->createUpdateDepartment(json_decode(file_get_contents('php://input'), true), $sharedID));
            break;
        }
        if ($sharedID) {
            echo json_encode($departmentController->getByIdDepartments($sharedID));
            break;
        } else {
            echo json_encode($departmentController->getDepartments());
            break;
        }

    case 'equipment':
        if ($requestMethod == 'POST') {
            echo json_encode($equipmentController->createUpdateEquipment(json_decode(file_get_contents('php://input'), true), $sharedID));
            break;
        }
        if ($sharedID) {
            echo json_encode($equipmentController->getByIdEquipment($sharedID));
            break;
        } else {
            echo json_encode($equipmentController->getEquipment());
            break;
        }
    case 'service-organizations':
        if ($requestMethod == 'POST') {
            echo json_encode($serviceOrganizationController->createUpdateServiceOrganization(json_decode(file_get_contents('php://input'), true), $sharedID));
            break;
        }
        if ($sharedID) {
            echo json_encode($serviceOrganizationController->getByIdServiceOrganization($sharedID));
            break;
        } else {
            echo json_encode($serviceOrganizationController->getServiceOrganizations());
            break;
        }
    // Добавьте в switch-case:
    case 'equipment-statuses':
        if ($requestMethod == 'POST') {
            echo json_encode($equipmentStatusController->createUpdateEquipmentStatus(json_decode(file_get_contents('php://input'), true), $sharedID));
            break;
        }
        if ($sharedID) {
            echo json_encode($equipmentStatusController->getByIdEquipmentStatus($sharedID));
            break;
        } else {
            echo json_encode($equipmentStatusController->getEquipmentStatuses());
            break;
        }

    case 'remove-equipment-statuses':
        echo json_encode($equipmentStatusController->removeEquipmentStatus($sharedID));
        break;

    case 'remove-mols':
        echo json_encode($molController->removeMOLs($sharedID));
        break;
    case 'remove-departments':
        echo json_encode($departmentController->removeDepartments($sharedID));
        break;
    case 'remove-equipment':
        echo json_encode($equipmentController->removeEquipment($sharedID));
        break;
    case 'remove-service-organizations':
        echo json_encode($serviceOrganizationController->removeServiceOrganization($sharedID));
        break;
    default:
        echo json_encode(['error' => 'Invalid action']);
        break;
}