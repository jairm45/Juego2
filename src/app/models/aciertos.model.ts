// src/app/models/aciertos.model.ts
export interface Aciertos {
  id?: number;
  partida_id: number;
  user_id: string; // Asumiendo que tu backend acepta UUIDs (string)
  aciertos: number;
  tiempo: string; // <-- ¡Este campo es requerido por tu backend!
}
