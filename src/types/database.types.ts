export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      auth_group: {
        Row: {
          id: number
          name: string
        }
        Insert: {
          id?: number
          name: string
        }
        Update: {
          id?: number
          name?: string
        }
        Relationships: []
      }
      auth_group_permissions: {
        Row: {
          group_id: number
          id: number
          permission_id: number
        }
        Insert: {
          group_id: number
          id?: number
          permission_id: number
        }
        Update: {
          group_id?: number
          id?: number
          permission_id?: number
        }
        Relationships: [
          {
            foreignKeyName: 'auth_group_permissio_permission_id_84c5c92e_fk_auth_perm'
            columns: ['permission_id']
            referencedRelation: 'auth_permission'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'auth_group_permissions_group_id_b120cbf9_fk_auth_group_id'
            columns: ['group_id']
            referencedRelation: 'auth_group'
            referencedColumns: ['id']
          }
        ]
      }
      auth_permission: {
        Row: {
          codename: string
          content_type_id: number
          id: number
          name: string
        }
        Insert: {
          codename: string
          content_type_id: number
          id?: number
          name: string
        }
        Update: {
          codename?: string
          content_type_id?: number
          id?: number
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: 'auth_permission_content_type_id_2f476e4b_fk_django_co'
            columns: ['content_type_id']
            referencedRelation: 'django_content_type'
            referencedColumns: ['id']
          }
        ]
      }
      django_admin_log: {
        Row: {
          action_flag: number
          action_time: string
          change_message: string
          content_type_id: number | null
          id: number
          object_id: string | null
          object_repr: string
          user_id: number
        }
        Insert: {
          action_flag: number
          action_time: string
          change_message: string
          content_type_id?: number | null
          id?: number
          object_id?: string | null
          object_repr: string
          user_id: number
        }
        Update: {
          action_flag?: number
          action_time?: string
          change_message?: string
          content_type_id?: number | null
          id?: number
          object_id?: string | null
          object_repr?: string
          user_id?: number
        }
        Relationships: [
          {
            foreignKeyName: 'django_admin_log_content_type_id_c4bce8eb_fk_django_co'
            columns: ['content_type_id']
            referencedRelation: 'django_content_type'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'django_admin_log_user_id_c564eba6_fk_kpi_app_user_id'
            columns: ['user_id']
            referencedRelation: 'kpi_app_user'
            referencedColumns: ['id']
          }
        ]
      }
      django_content_type: {
        Row: {
          app_label: string
          id: number
          model: string
        }
        Insert: {
          app_label: string
          id?: number
          model: string
        }
        Update: {
          app_label?: string
          id?: number
          model?: string
        }
        Relationships: []
      }
      django_migrations: {
        Row: {
          app: string
          applied: string
          id: number
          name: string
        }
        Insert: {
          app: string
          applied: string
          id?: number
          name: string
        }
        Update: {
          app?: string
          applied?: string
          id?: number
          name?: string
        }
        Relationships: []
      }
      django_session: {
        Row: {
          expire_date: string
          session_data: string
          session_key: string
        }
        Insert: {
          expire_date: string
          session_data: string
          session_key: string
        }
        Update: {
          expire_date?: string
          session_data?: string
          session_key?: string
        }
        Relationships: []
      }
      kpi_app: {
        Row: {
          created_at: string
          id: number
        }
        Insert: {
          created_at?: string
          id?: number
        }
        Update: {
          created_at?: string
          id?: number
        }
        Relationships: []
      }
      kpi_app_audit: {
        Row: {
          circle_kpi_id: number
          created_timestamp: string
          id: number
          period_id: number
          updated_timestamp: string
          user_id: number
          value: number | null
        }
        Insert: {
          circle_kpi_id: number
          created_timestamp: string
          id?: number
          period_id: number
          updated_timestamp: string
          user_id: number
          value?: number | null
        }
        Update: {
          circle_kpi_id?: number
          created_timestamp?: string
          id?: number
          period_id?: number
          updated_timestamp?: string
          user_id?: number
          value?: number | null
        }
        Relationships: [
          {
            foreignKeyName: 'kpi_app_audit_circle_kpi_id_0e19418e_fk_kpi_app_circle_kpi_id'
            columns: ['circle_kpi_id']
            referencedRelation: 'kpi_app_circle_kpi'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'kpi_app_audit_period_id_2b22ccff_fk_kpi_app_period_id'
            columns: ['period_id']
            referencedRelation: 'kpi_app_period'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'kpi_app_audit_user_id_0c730a00_fk_kpi_app_user_id'
            columns: ['user_id']
            referencedRelation: 'kpi_app_user'
            referencedColumns: ['id']
          }
        ]
      }
      kpi_app_circle: {
        Row: {
          id: number
          name: string
        }
        Insert: {
          id?: number
          name: string
        }
        Update: {
          id?: number
          name?: string
        }
        Relationships: []
      }
      kpi_app_circle_kpi: {
        Row: {
          circle_id_id: number
          id: number
          kpi_id_id: number
        }
        Insert: {
          circle_id_id: number
          id?: number
          kpi_id_id: number
        }
        Update: {
          circle_id_id?: number
          id?: number
          kpi_id_id?: number
        }
        Relationships: [
          {
            foreignKeyName: 'kpi_app_circle_kpi_circle_id_id_b2838ae2_fk_kpi_app_circle_id'
            columns: ['circle_id_id']
            referencedRelation: 'kpi_app_circle'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'kpi_app_circle_kpi_kpi_id_id_cc4b65e9_fk_kpi_app_kpi_id'
            columns: ['kpi_id_id']
            referencedRelation: 'kpi_app_kpi'
            referencedColumns: ['id']
          }
        ]
      }
      kpi_app_kpi: {
        Row: {
          id: number
          name: string
          periodicity_id: number
          range_id: number
        }
        Insert: {
          id?: number
          name: string
          periodicity_id: number
          range_id: number
        }
        Update: {
          id?: number
          name?: string
          periodicity_id?: number
          range_id?: number
        }
        Relationships: [
          {
            foreignKeyName: 'kpi_app_kpi_periodicity_id_a8778d2d_fk_kpi_app_periodicity_id'
            columns: ['periodicity_id']
            referencedRelation: 'kpi_app_periodicity'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'kpi_app_kpi_range_id_8de87dce_fk_kpi_app_range_id'
            columns: ['range_id']
            referencedRelation: 'kpi_app_range'
            referencedColumns: ['id']
          }
        ]
      }
      kpi_app_period: {
        Row: {
          id: number
          month: number | null
          quarter: number | null
          year: number
        }
        Insert: {
          id?: number
          month?: number | null
          quarter?: number | null
          year: number
        }
        Update: {
          id?: number
          month?: number | null
          quarter?: number | null
          year?: number
        }
        Relationships: []
      }
      kpi_app_periodicity: {
        Row: {
          description: string
          id: number
          type: string
        }
        Insert: {
          description: string
          id?: number
          type: string
        }
        Update: {
          description?: string
          id?: number
          type?: string
        }
        Relationships: []
      }
      kpi_app_range: {
        Row: {
          display_value: string
          id: number
          max_value: number
          min_value: number
        }
        Insert: {
          display_value: string
          id?: number
          max_value: number
          min_value: number
        }
        Update: {
          display_value?: string
          id?: number
          max_value?: number
          min_value?: number
        }
        Relationships: []
      }
      kpi_app_role: {
        Row: {
          description: string
          id: number
          name: string
        }
        Insert: {
          description: string
          id?: number
          name: string
        }
        Update: {
          description?: string
          id?: number
          name?: string
        }
        Relationships: []
      }
      kpi_app_user: {
        Row: {
          date_joined: string
          email: string
          first_name: string
          id: number
          is_active: boolean
          is_staff: boolean
          is_superuser: boolean
          last_login: string | null
          last_name: string
          password: string
          role_id_id: number | null
          username: string
        }
        Insert: {
          date_joined: string
          email: string
          first_name: string
          id?: number
          is_active: boolean
          is_staff: boolean
          is_superuser: boolean
          last_login?: string | null
          last_name: string
          password: string
          role_id_id?: number | null
          username: string
        }
        Update: {
          date_joined?: string
          email?: string
          first_name?: string
          id?: number
          is_active?: boolean
          is_staff?: boolean
          is_superuser?: boolean
          last_login?: string | null
          last_name?: string
          password?: string
          role_id_id?: number | null
          username?: string
        }
        Relationships: [
          {
            foreignKeyName: 'kpi_app_user_role_id_id_a0e2af70_fk_kpi_app_role_id'
            columns: ['role_id_id']
            referencedRelation: 'kpi_app_role'
            referencedColumns: ['id']
          }
        ]
      }
      kpi_app_user_circle: {
        Row: {
          circle_id_id: number
          id: number
          user_id_id: number
        }
        Insert: {
          circle_id_id: number
          id?: number
          user_id_id: number
        }
        Update: {
          circle_id_id?: number
          id?: number
          user_id_id?: number
        }
        Relationships: [
          {
            foreignKeyName: 'kpi_app_user_circle_circle_id_id_85c67dc1_fk_kpi_app_circle_id'
            columns: ['circle_id_id']
            referencedRelation: 'kpi_app_circle'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'kpi_app_user_circle_user_id_id_1e2561c6_fk_kpi_app_user_id'
            columns: ['user_id_id']
            referencedRelation: 'kpi_app_user'
            referencedColumns: ['id']
          }
        ]
      }
      kpi_app_user_groups: {
        Row: {
          group_id: number
          id: number
          user_id: number
        }
        Insert: {
          group_id: number
          id?: number
          user_id: number
        }
        Update: {
          group_id?: number
          id?: number
          user_id?: number
        }
        Relationships: [
          {
            foreignKeyName: 'kpi_app_user_groups_group_id_8cb2d405_fk_auth_group_id'
            columns: ['group_id']
            referencedRelation: 'auth_group'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'kpi_app_user_groups_user_id_487911c2_fk_kpi_app_user_id'
            columns: ['user_id']
            referencedRelation: 'kpi_app_user'
            referencedColumns: ['id']
          }
        ]
      }
      kpi_app_user_user_permissions: {
        Row: {
          id: number
          permission_id: number
          user_id: number
        }
        Insert: {
          id?: number
          permission_id: number
          user_id: number
        }
        Update: {
          id?: number
          permission_id?: number
          user_id?: number
        }
        Relationships: [
          {
            foreignKeyName: 'kpi_app_user_user_pe_permission_id_c4e38da0_fk_auth_perm'
            columns: ['permission_id']
            referencedRelation: 'auth_permission'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'kpi_app_user_user_pe_user_id_dd9f0cc3_fk_kpi_app_u'
            columns: ['user_id']
            referencedRelation: 'kpi_app_user'
            referencedColumns: ['id']
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
