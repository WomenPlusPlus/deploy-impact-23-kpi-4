export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
    graphql_public: {
        Tables: {
            [_ in never]: never
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            graphql: {
                Args: {
                    operationName?: string
                    query?: string
                    variables?: Json
                    extensions?: Json
                }
                Returns: Json
            }
        }
        Enums: {
            [_ in never]: never
        }
        CompositeTypes: {
            [_ in never]: never
        }
    }
    public: {
        Tables: {
            audit: {
                Row: {
                    circle_kpi_id: number
                    created_at: string
                    id: number
                    period_kpi_id: number
                    user_id: string
                    value: number
                }
                Insert: {
                    circle_kpi_id: number
                    created_at?: string
                    id?: never
                    period_kpi_id: number
                    user_id: string
                    value: number
                }
                Update: {
                    circle_kpi_id?: number
                    created_at?: string
                    id?: never
                    period_kpi_id?: number
                    user_id?: string
                    value?: number
                }
                Relationships: [
                    {
                        foreignKeyName: 'audit_circle_kpi_id_fkey'
                        columns: ['circle_kpi_id']
                        referencedRelation: 'circle_kpi'
                        referencedColumns: ['id']
                    },
                    {
                        foreignKeyName: 'audit_period_kpi_id_fkey'
                        columns: ['period_kpi_id']
                        referencedRelation: 'kpi_period'
                        referencedColumns: ['id']
                    },
                    {
                        foreignKeyName: 'audit_user_id_fkey'
                        columns: ['user_id']
                        referencedRelation: 'users'
                        referencedColumns: ['id']
                    }
                ]
            }
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
            auth_user: {
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
                    username?: string
                }
                Relationships: []
            }
            auth_user_groups: {
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
                        foreignKeyName: 'auth_user_groups_group_id_97559544_fk_auth_group_id'
                        columns: ['group_id']
                        referencedRelation: 'auth_group'
                        referencedColumns: ['id']
                    },
                    {
                        foreignKeyName: 'auth_user_groups_user_id_6a12ed8b_fk_auth_user_id'
                        columns: ['user_id']
                        referencedRelation: 'auth_user'
                        referencedColumns: ['id']
                    }
                ]
            }
            auth_user_user_permissions: {
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
                        foreignKeyName: 'auth_user_user_permi_permission_id_1fbb5f2c_fk_auth_perm'
                        columns: ['permission_id']
                        referencedRelation: 'auth_permission'
                        referencedColumns: ['id']
                    },
                    {
                        foreignKeyName: 'auth_user_user_permissions_user_id_a95ead1b_fk_auth_user_id'
                        columns: ['user_id']
                        referencedRelation: 'auth_user'
                        referencedColumns: ['id']
                    }
                ]
            }
            circle: {
                Row: {
                    created_at: string
                    id: number
                    name: string
                }
                Insert: {
                    created_at?: string
                    id?: number
                    name: string
                }
                Update: {
                    created_at?: string
                    id?: number
                    name?: string
                }
                Relationships: []
            }
            circle_kpi: {
                Row: {
                    circle_id: number
                    id: number
                    kpi_id: number
                }
                Insert: {
                    circle_id: number
                    id?: number
                    kpi_id: number
                }
                Update: {
                    circle_id?: number
                    id?: number
                    kpi_id?: number
                }
                Relationships: [
                    {
                        foreignKeyName: 'circle_kpi_circle_id_fkey'
                        columns: ['circle_id']
                        referencedRelation: 'circle'
                        referencedColumns: ['id']
                    },
                    {
                        foreignKeyName: 'circle_kpi_kpi_id_fkey'
                        columns: ['kpi_id']
                        referencedRelation: 'kpi'
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
                        foreignKeyName: 'django_admin_log_user_id_c564eba6_fk_auth_user_id'
                        columns: ['user_id']
                        referencedRelation: 'auth_user'
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
            frequency: {
                Row: {
                    created_at: string
                    description: string | null
                    id: number
                    type: string
                }
                Insert: {
                    created_at?: string
                    description?: string | null
                    id?: number
                    type: string
                }
                Update: {
                    created_at?: string
                    description?: string | null
                    id?: number
                    type?: string
                }
                Relationships: []
            }
            kpi: {
                Row: {
                    created_at: string
                    description: string | null
                    frequency_id: number
                    id: number
                    name: string
                    range_id: number
                    sample_value: number
                }
                Insert: {
                    created_at?: string
                    description?: string | null
                    frequency_id: number
                    id?: number
                    name: string
                    range_id: number
                    sample_value: number
                }
                Update: {
                    created_at?: string
                    description?: string | null
                    frequency_id?: number
                    id?: number
                    name?: string
                    range_id?: number
                    sample_value?: number
                }
                Relationships: [
                    {
                        foreignKeyName: 'kpi_frequency_id_fkey'
                        columns: ['frequency_id']
                        referencedRelation: 'frequency'
                        referencedColumns: ['id']
                    },
                    {
                        foreignKeyName: 'kpi_range_id_fkey'
                        columns: ['range_id']
                        referencedRelation: 'range'
                        referencedColumns: ['id']
                    }
                ]
            }
            kpi_period: {
                Row: {
                    id: number
                    kpi_id: number
                    period_id: number
                }
                Insert: {
                    id?: number
                    kpi_id: number
                    period_id: number
                }
                Update: {
                    id?: number
                    kpi_id?: number
                    period_id?: number
                }
                Relationships: [
                    {
                        foreignKeyName: 'kpi_period_kpi_id_fkey'
                        columns: ['kpi_id']
                        referencedRelation: 'kpi'
                        referencedColumns: ['id']
                    },
                    {
                        foreignKeyName: 'kpi_period_period_id_fkey'
                        columns: ['period_id']
                        referencedRelation: 'period'
                        referencedColumns: ['id']
                    }
                ]
            }
            period: {
                Row: {
                    created_at: string
                    id: number
                    month: number | null
                    quarter: number | null
                    year: number
                }
                Insert: {
                    created_at?: string
                    id?: number
                    month?: number | null
                    quarter?: number | null
                    year: number
                }
                Update: {
                    created_at?: string
                    id?: number
                    month?: number | null
                    quarter?: number | null
                    year?: number
                }
                Relationships: []
            }
            range: {
                Row: {
                    created_at: string
                    display_value: string | null
                    id: number
                    max_value: number | null
                    min_value: number | null
                }
                Insert: {
                    created_at?: string
                    display_value?: string | null
                    id?: number
                    max_value?: number | null
                    min_value?: number | null
                }
                Update: {
                    created_at?: string
                    display_value?: string | null
                    id?: number
                    max_value?: number | null
                    min_value?: number | null
                }
                Relationships: []
            }
            user_circle: {
                Row: {
                    circle_id: number
                    created_at: string
                    user_id: string
                }
                Insert: {
                    circle_id: number
                    created_at?: string
                    user_id: string
                }
                Update: {
                    circle_id?: number
                    created_at?: string
                    user_id?: string
                }
                Relationships: [
                    {
                        foreignKeyName: 'user_circle_circle_id_fkey'
                        columns: ['circle_id']
                        referencedRelation: 'circle'
                        referencedColumns: ['id']
                    },
                    {
                        foreignKeyName: 'user_circle_user_id_fkey'
                        columns: ['user_id']
                        referencedRelation: 'users'
                        referencedColumns: ['id']
                    }
                ]
            }
            users: {
                Row: {
                    email: string
                    first_name: string | null
                    id: string
                    last_name: string | null
                    role: string
                }
                Insert: {
                    email: string
                    first_name?: string | null
                    id: string
                    last_name?: string | null
                    role?: string
                }
                Update: {
                    email?: string
                    first_name?: string | null
                    id?: string
                    last_name?: string | null
                    role?: string
                }
                Relationships: [
                    {
                        foreignKeyName: 'users_id_fkey'
                        columns: ['id']
                        referencedRelation: 'users'
                        referencedColumns: ['id']
                    }
                ]
            }
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            check_circle: {
                Args: {
                    user_id: string
                    kpi_id: number
                }
                Returns: boolean
            }
            get_kpi: {
                Args: {
                    circle_kpi_id: number
                }
                Returns: number
            }
            insert_new_periods: {
                Args: {
                    new_year: number
                }
                Returns: undefined
            }
            insert_new_year_periods: {
                Args: {
                    new_year: number
                }
                Returns: undefined
            }
            test: {
                Args: {
                    kpi_id: number
                }
                Returns: number
            }
        }
        Enums: {
            [_ in never]: never
        }
        CompositeTypes: {
            [_ in never]: never
        }
    }
    storage: {
        Tables: {
            buckets: {
                Row: {
                    allowed_mime_types: string[] | null
                    avif_autodetection: boolean | null
                    created_at: string | null
                    file_size_limit: number | null
                    id: string
                    name: string
                    owner: string | null
                    public: boolean | null
                    updated_at: string | null
                }
                Insert: {
                    allowed_mime_types?: string[] | null
                    avif_autodetection?: boolean | null
                    created_at?: string | null
                    file_size_limit?: number | null
                    id: string
                    name: string
                    owner?: string | null
                    public?: boolean | null
                    updated_at?: string | null
                }
                Update: {
                    allowed_mime_types?: string[] | null
                    avif_autodetection?: boolean | null
                    created_at?: string | null
                    file_size_limit?: number | null
                    id?: string
                    name?: string
                    owner?: string | null
                    public?: boolean | null
                    updated_at?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: 'buckets_owner_fkey'
                        columns: ['owner']
                        referencedRelation: 'users'
                        referencedColumns: ['id']
                    }
                ]
            }
            migrations: {
                Row: {
                    executed_at: string | null
                    hash: string
                    id: number
                    name: string
                }
                Insert: {
                    executed_at?: string | null
                    hash: string
                    id: number
                    name: string
                }
                Update: {
                    executed_at?: string | null
                    hash?: string
                    id?: number
                    name?: string
                }
                Relationships: []
            }
            objects: {
                Row: {
                    bucket_id: string | null
                    created_at: string | null
                    id: string
                    last_accessed_at: string | null
                    metadata: Json | null
                    name: string | null
                    owner: string | null
                    path_tokens: string[] | null
                    updated_at: string | null
                    version: string | null
                }
                Insert: {
                    bucket_id?: string | null
                    created_at?: string | null
                    id?: string
                    last_accessed_at?: string | null
                    metadata?: Json | null
                    name?: string | null
                    owner?: string | null
                    path_tokens?: string[] | null
                    updated_at?: string | null
                    version?: string | null
                }
                Update: {
                    bucket_id?: string | null
                    created_at?: string | null
                    id?: string
                    last_accessed_at?: string | null
                    metadata?: Json | null
                    name?: string | null
                    owner?: string | null
                    path_tokens?: string[] | null
                    updated_at?: string | null
                    version?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: 'objects_bucketId_fkey'
                        columns: ['bucket_id']
                        referencedRelation: 'buckets'
                        referencedColumns: ['id']
                    },
                    {
                        foreignKeyName: 'objects_owner_fkey'
                        columns: ['owner']
                        referencedRelation: 'users'
                        referencedColumns: ['id']
                    }
                ]
            }
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            can_insert_object: {
                Args: {
                    bucketid: string
                    name: string
                    owner: string
                    metadata: Json
                }
                Returns: undefined
            }
            extension: {
                Args: {
                    name: string
                }
                Returns: string
            }
            filename: {
                Args: {
                    name: string
                }
                Returns: string
            }
            foldername: {
                Args: {
                    name: string
                }
                Returns: unknown
            }
            get_size_by_bucket: {
                Args: Record<PropertyKey, never>
                Returns: {
                    size: number
                    bucket_id: string
                }[]
            }
            search: {
                Args: {
                    prefix: string
                    bucketname: string
                    limits?: number
                    levels?: number
                    offsets?: number
                    search?: string
                    sortcolumn?: string
                    sortorder?: string
                }
                Returns: {
                    name: string
                    id: string
                    updated_at: string
                    created_at: string
                    last_accessed_at: string
                    metadata: Json
                }[]
            }
        }
        Enums: {
            [_ in never]: never
        }
        CompositeTypes: {
            [_ in never]: never
        }
    }
}
