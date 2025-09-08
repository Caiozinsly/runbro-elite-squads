export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      bilhetes_sorteio: {
        Row: {
          corrida_id: number
          created_at: string
          id: number
          is_premium: boolean
          usado: boolean
          utilizador_id: string
        }
        Insert: {
          corrida_id: number
          created_at?: string
          id?: number
          is_premium?: boolean
          usado?: boolean
          utilizador_id: string
        }
        Update: {
          corrida_id?: number
          created_at?: string
          id?: number
          is_premium?: boolean
          usado?: boolean
          utilizador_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bilhetes_sorteio_corrida_id_fkey"
            columns: ["corrida_id"]
            isOneToOne: false
            referencedRelation: "corridas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bilhetes_sorteio_utilizador_id_fkey"
            columns: ["utilizador_id"]
            isOneToOne: false
            referencedRelation: "perfis"
            referencedColumns: ["id"]
          },
        ]
      }
      challenges: {
        Row: {
          ativo: boolean
          created_at: string
          descricao: string | null
          distancia_km: number
          id: string
          nome: string
          pontos_recompensa: number
          tempo_limite_minutos: number
          updated_at: string
        }
        Insert: {
          ativo?: boolean
          created_at?: string
          descricao?: string | null
          distancia_km: number
          id?: string
          nome: string
          pontos_recompensa?: number
          tempo_limite_minutos: number
          updated_at?: string
        }
        Update: {
          ativo?: boolean
          created_at?: string
          descricao?: string | null
          distancia_km?: number
          id?: string
          nome?: string
          pontos_recompensa?: number
          tempo_limite_minutos?: number
          updated_at?: string
        }
        Relationships: []
      }
      corridas: {
        Row: {
          created_at: string
          data_corrida: string
          id: number
          squad_id: string
          status: string
        }
        Insert: {
          created_at?: string
          data_corrida: string
          id?: number
          squad_id: string
          status?: string
        }
        Update: {
          created_at?: string
          data_corrida?: string
          id?: number
          squad_id?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "corridas_squad_id_fkey"
            columns: ["squad_id"]
            isOneToOne: false
            referencedRelation: "squads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "corridas_squad_id_fkey"
            columns: ["squad_id"]
            isOneToOne: false
            referencedRelation: "squads_com_periodo"
            referencedColumns: ["id"]
          },
        ]
      }
      mural_photos: {
        Row: {
          approved: boolean | null
          caption: string | null
          created_at: string | null
          id: string
          photo_url: string
          squad_id: string | null
          user_id: string | null
        }
        Insert: {
          approved?: boolean | null
          caption?: string | null
          created_at?: string | null
          id?: string
          photo_url: string
          squad_id?: string | null
          user_id?: string | null
        }
        Update: {
          approved?: boolean | null
          caption?: string | null
          created_at?: string | null
          id?: string
          photo_url?: string
          squad_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "mural_photos_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      perfis: {
        Row: {
          avatar_url: string | null
          bro_gems: number
          id: string
          run_coins: number
          updated_at: string | null
          username: string | null
          xp: number
        }
        Insert: {
          avatar_url?: string | null
          bro_gems?: number
          id: string
          run_coins?: number
          updated_at?: string | null
          username?: string | null
          xp?: number
        }
        Update: {
          avatar_url?: string | null
          bro_gems?: number
          id?: string
          run_coins?: number
          updated_at?: string | null
          username?: string | null
          xp?: number
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          cards_completados: number | null
          created_at: string | null
          full_name: string | null
          id: string
          km_percorridos: number | null
          points: number | null
          strava_access_token: string | null
          strava_athlete_id: string | null
          strava_refresh_token: string | null
          strava_token_expires_at: string | null
          updated_at: string | null
          username: string
        }
        Insert: {
          avatar_url?: string | null
          cards_completados?: number | null
          created_at?: string | null
          full_name?: string | null
          id: string
          km_percorridos?: number | null
          points?: number | null
          strava_access_token?: string | null
          strava_athlete_id?: string | null
          strava_refresh_token?: string | null
          strava_token_expires_at?: string | null
          updated_at?: string | null
          username: string
        }
        Update: {
          avatar_url?: string | null
          cards_completados?: number | null
          created_at?: string | null
          full_name?: string | null
          id?: string
          km_percorridos?: number | null
          points?: number | null
          strava_access_token?: string | null
          strava_athlete_id?: string | null
          strava_refresh_token?: string | null
          strava_token_expires_at?: string | null
          updated_at?: string | null
          username?: string
        }
        Relationships: []
      }
      squad_challenge_completions: {
        Row: {
          challenge_id: string
          completed_at: string
          id: string
          km_total: number
          pace_medio: number
          pontos_ganhos: number
          squad_id: string
          tempo_total_minutos: number
        }
        Insert: {
          challenge_id: string
          completed_at?: string
          id?: string
          km_total: number
          pace_medio: number
          pontos_ganhos?: number
          squad_id: string
          tempo_total_minutos: number
        }
        Update: {
          challenge_id?: string
          completed_at?: string
          id?: string
          km_total?: number
          pace_medio?: number
          pontos_ganhos?: number
          squad_id?: string
          tempo_total_minutos?: number
        }
        Relationships: []
      }
      squad_members: {
        Row: {
          id: string
          joined_at: string | null
          squad_id: string | null
          status: string | null
          user_id: string | null
        }
        Insert: {
          id?: string
          joined_at?: string | null
          squad_id?: string | null
          status?: string | null
          user_id?: string | null
        }
        Update: {
          id?: string
          joined_at?: string | null
          squad_id?: string | null
          status?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "squad_members_squad_id_fkey"
            columns: ["squad_id"]
            isOneToOne: false
            referencedRelation: "squads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "squad_members_squad_id_fkey"
            columns: ["squad_id"]
            isOneToOne: false
            referencedRelation: "squads_com_periodo"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "squad_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      squads: {
        Row: {
          admin_id: string
          capa_url: string | null
          cidade: string
          codigo_convite: string | null
          created_at: string
          descricao: string | null
          distancia_km: number
          horario: string | null
          id: string
          is_public: boolean
          limite_membros: number
          nome: string
          periodo: string | null
          ponto_partida: string | null
        }
        Insert: {
          admin_id: string
          capa_url?: string | null
          cidade: string
          codigo_convite?: string | null
          created_at?: string
          descricao?: string | null
          distancia_km: number
          horario?: string | null
          id?: string
          is_public?: boolean
          limite_membros?: number
          nome: string
          periodo?: string | null
          ponto_partida?: string | null
        }
        Update: {
          admin_id?: string
          capa_url?: string | null
          cidade?: string
          codigo_convite?: string | null
          created_at?: string
          descricao?: string | null
          distancia_km?: number
          horario?: string | null
          id?: string
          is_public?: boolean
          limite_membros?: number
          nome?: string
          periodo?: string | null
          ponto_partida?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "squads_admin_id_fkey"
            columns: ["admin_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      squads_com_periodo: {
        Row: {
          admin_id: string | null
          capa_url: string | null
          cidade: string | null
          created_at: string | null
          descricao: string | null
          distancia_km: number | null
          horario: string | null
          id: string | null
          is_public: boolean | null
          limite_membros: number | null
          nome: string | null
          periodo_calculado: string | null
          ponto_partida: string | null
        }
        Insert: {
          admin_id?: string | null
          capa_url?: string | null
          cidade?: string | null
          created_at?: string | null
          descricao?: string | null
          distancia_km?: number | null
          horario?: string | null
          id?: string | null
          is_public?: boolean | null
          limite_membros?: number | null
          nome?: string | null
          periodo_calculado?: never
          ponto_partida?: string | null
        }
        Update: {
          admin_id?: string | null
          capa_url?: string | null
          cidade?: string | null
          created_at?: string | null
          descricao?: string | null
          distancia_km?: number | null
          horario?: string | null
          id?: string | null
          is_public?: boolean | null
          limite_membros?: number | null
          nome?: string | null
          periodo_calculado?: never
          ponto_partida?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "squads_admin_id_fkey"
            columns: ["admin_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      add_kms: {
        Args: { kms_to_add: number; user_id: string }
        Returns: undefined
      }
      delete_squad: {
        Args: { squad_id_param: string }
        Returns: boolean
      }
      generate_invite_code: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_squad_details: {
        Args: { squad_id_param: string }
        Returns: {
          admin_avatar_url: string
          admin_id: string
          admin_username: string
          capa_url: string
          cidade: string
          created_at: string
          descricao: string
          distancia_km: number
          horario: string
          id: string
          is_public: boolean
          limite_membros: number
          nome: string
          ponto_partida: string
        }[]
      }
      get_squads_com_detalhes: {
        Args: Record<PropertyKey, never>
        Returns: {
          admin_avatar_url: string
          admin_id: string
          admin_username: string
          capa_url: string
          cidade: string
          codigo_convite: string
          created_at: string
          descricao: string
          distancia_km: number
          horario: string
          id: string
          is_public: boolean
          limite_membros: number
          member_count: number
          nome: string
          periodo_calculado: string
          ponto_partida: string
        }[]
      }
      increment_cards: {
        Args: { user_id: string }
        Returns: undefined
      }
    }
    Enums: {
      member_status: "pending" | "approved" | "rejected"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      member_status: ["pending", "approved", "rejected"],
    },
  },
} as const
