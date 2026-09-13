import type { EnxovalItem, EnxovalItemInput } from "./enxoval";

export type Database = {
  public: {
    Tables: {
      enxoval_itens: {
        Row: EnxovalItem;
        Insert: Partial<EnxovalItemInput> & Pick<EnxovalItemInput, "nome">;
        Update: Partial<EnxovalItemInput>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
  };
};
