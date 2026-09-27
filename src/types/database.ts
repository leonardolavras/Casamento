import type { EnxovalItem, EnxovalItemInput, EnxovalPresente, EnxovalPresenteInput } from "./enxoval";

export type MuralRecado = {
  id: string;
  nome: string;
  mensagem: string;
  created_at: string;
};

export type Database = {
  public: {
    Tables: {
      enxoval_itens: {
        Row: EnxovalItem;
        Insert: Partial<EnxovalItemInput> & Pick<EnxovalItemInput, "nome">;
        Update: Partial<EnxovalItemInput>;
        Relationships: [];
      };
      mural_recados: {
        Row: MuralRecado;
        Insert: Pick<MuralRecado, "nome" | "mensagem">;
        Update: Partial<Pick<MuralRecado, "nome" | "mensagem">>;
        Relationships: [];
      };
      enxoval_presentes: {
        Row: EnxovalPresente;
        Insert: EnxovalPresenteInput;
        Update: Partial<EnxovalPresenteInput>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
  };
};
