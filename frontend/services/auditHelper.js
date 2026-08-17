/**
 * Motor de Auditoría Local - Ganadería Pro
 * Analiza registros locales para prevenir duplicados o errores antes del sync.
 */
(function () {
    async function checkDailyConflict(newRecord) {
        if (!window.offlineSync) return null;

        const records = await window.offlineSync.getAllRecords(); // Necesitaré exponer este método
        const today = new Date().toLocaleDateString();

        // Ejemplo: Evitar pesar el mismo animal dos veces el mismo día
        if (newRecord.path === '/operaciones/produccion') {
            const duplicate = records.find(r =>
                r.body.ganado_id === newRecord.body.ganado_id &&
                new Date(r.createdAt).toLocaleDateString() === today
            );
            if (duplicate) return "Este animal ya tiene un registro de hoy. ¿Desea registrar de nuevo?";
        }

        return null;
    }

    window.auditHelper = { checkDailyConflict };
})();
