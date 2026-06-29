export class ThinkingLogger {
    static log(session_id: string, message: string, data?: any) {
        console.log(`[HCOS:${session_id}] ${message}`, data ? data : "");
    }
}
