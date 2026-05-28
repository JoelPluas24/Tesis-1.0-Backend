"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CumplimientoRepository = void 0;
var database_js_1 = require("../config/database.js");
var CumplimientoRepository = /** @class */ (function () {
    function CumplimientoRepository() {
    }
    CumplimientoRepository.getPacienteIdByUsuarioId = function (usuarioId) {
        return __awaiter(this, void 0, void 0, function () {
            var rows;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, database_js_1.pool.query("SELECT id FROM pacientes WHERE usuario_id = ?", [usuarioId])];
                    case 1:
                        rows = (_b.sent())[0];
                        return [2 /*return*/, (_a = rows[0]) === null || _a === void 0 ? void 0 : _a.id];
                }
            });
        });
    };
    CumplimientoRepository.checkEjercicioCompletedToday = function (pacienteId, ejercicioId) {
        return __awaiter(this, void 0, void 0, function () {
            var rows;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, database_js_1.pool.query("SELECT id FROM cumplimiento_ejercicios \n       WHERE paciente_id = ? AND ejercicio_id = ? AND fecha = CURDATE()", [pacienteId, ejercicioId])];
                    case 1:
                        rows = (_a.sent())[0];
                        return [2 /*return*/, rows.length > 0];
                }
            });
        });
    };
    CumplimientoRepository.addCumplimiento = function (pacienteId, ejercicioId, fecha) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, database_js_1.pool.query("INSERT INTO cumplimiento_ejercicios \n       (paciente_id, ejercicio_id, fecha, completado)\n       VALUES (?, ?, ?, 1)", [pacienteId, ejercicioId, fecha])];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    CumplimientoRepository.getRutinaActivaConFechas = function (pacienteId) {
        return __awaiter(this, void 0, void 0, function () {
            var rows;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, database_js_1.pool.query("SELECT id, fecha_inicio, fecha_fin FROM rutinas WHERE paciente_id = ? AND activa = 1", [pacienteId])];
                    case 1:
                        rows = (_a.sent())[0];
                        return [2 /*return*/, rows[0] || null];
                }
            });
        });
    };
    CumplimientoRepository.getRutinaActivaId = function (pacienteId) {
        return __awaiter(this, void 0, void 0, function () {
            var row;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getRutinaActivaConFechas(pacienteId)];
                    case 1:
                        row = _a.sent();
                        return [2 /*return*/, row === null || row === void 0 ? void 0 : row.id];
                }
            });
        });
    };
    CumplimientoRepository.countEjerciciosRutina = function (rutinaId) {
        return __awaiter(this, void 0, void 0, function () {
            var rows;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, database_js_1.pool.query("SELECT COUNT(*) as total FROM rutina_ejercicios WHERE rutina_id = ?", [rutinaId])];
                    case 1:
                        rows = (_b.sent())[0];
                        return [2 /*return*/, ((_a = rows[0]) === null || _a === void 0 ? void 0 : _a.total) || 0];
                }
            });
        });
    };
    CumplimientoRepository.countTotalCumplimientosRutina = function (pacienteId, rutinaId, fechaInicio, fechaFin) {
        return __awaiter(this, void 0, void 0, function () {
            var rows;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, database_js_1.pool.query("SELECT COUNT(c.id) as realizados\n       FROM cumplimiento_ejercicios c\n       INNER JOIN rutina_ejercicios re ON c.ejercicio_id = re.ejercicio_id\n       WHERE c.paciente_id = ? AND re.rutina_id = ? AND c.fecha BETWEEN ? AND ?", [pacienteId, rutinaId, fechaInicio, fechaFin])];
                    case 1:
                        rows = (_b.sent())[0];
                        return [2 /*return*/, ((_a = rows[0]) === null || _a === void 0 ? void 0 : _a.realizados) || 0];
                }
            });
        });
    };
    CumplimientoRepository.countDistintosEjerciciosRealizados = function (pacienteId, rutinaId) {
        return __awaiter(this, void 0, void 0, function () {
            var rows;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, database_js_1.pool.query("SELECT COUNT(DISTINCT c.ejercicio_id) as realizados\n       FROM cumplimiento_ejercicios c\n       INNER JOIN rutina_ejercicios re ON c.ejercicio_id = re.ejercicio_id\n       WHERE c.paciente_id = ? AND re.rutina_id = ?", [pacienteId, rutinaId])];
                    case 1:
                        rows = (_b.sent())[0];
                        return [2 /*return*/, ((_a = rows[0]) === null || _a === void 0 ? void 0 : _a.realizados) || 0];
                }
            });
        });
    };
    CumplimientoRepository.deactivateUsuario = function (usuarioId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, database_js_1.pool.query("UPDATE usuarios SET activo = 0 WHERE id = ?", [usuarioId])];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    CumplimientoRepository.unassignFisioterapeuta = function (pacienteId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, database_js_1.pool.query("UPDATE pacientes SET fisioterapeuta_id = NULL WHERE id = ?", [pacienteId])];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    CumplimientoRepository.deactivateRutina = function (rutinaId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, database_js_1.pool.query("UPDATE rutinas SET activa = 0 WHERE id = ?", [rutinaId])];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    CumplimientoRepository.getProgresoResumen = function (pacienteId) {
        return __awaiter(this, void 0, void 0, function () {
            var rows;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, database_js_1.pool.query("SELECT \n        e.nombre,\n        COUNT(c.id) AS veces_realizado\n       FROM cumplimiento_ejercicios c\n       INNER JOIN ejercicios e ON c.ejercicio_id = e.id\n       WHERE c.paciente_id = ?\n       GROUP BY e.nombre", [pacienteId])];
                    case 1:
                        rows = (_a.sent())[0];
                        return [2 /*return*/, rows];
                }
            });
        });
    };
    CumplimientoRepository.getHistorialDiario = function (pacienteId) {
        return __awaiter(this, void 0, void 0, function () {
            var rows;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, database_js_1.pool.query("SELECT \n        c.fecha, \n        COUNT(c.id) as cantidad_ejercicios,\n        r.id as rutina_id,\n        p.nombre as patologia_nombre\n       FROM cumplimiento_ejercicios c\n       INNER JOIN rutina_ejercicios re ON c.ejercicio_id = re.ejercicio_id\n       INNER JOIN rutinas r ON re.rutina_id = r.id\n       LEFT JOIN patologias p ON r.patologia_id = p.id\n       WHERE c.paciente_id = ? AND r.paciente_id = ?\n       GROUP BY c.fecha, r.id, p.nombre\n       ORDER BY c.fecha DESC", [pacienteId, pacienteId])];
                    case 1:
                        rows = (_a.sent())[0];
                        return [2 /*return*/, rows];
                }
            });
        });
    };
    return CumplimientoRepository;
}());
exports.CumplimientoRepository = CumplimientoRepository;
