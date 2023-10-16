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
                    period_id: number
                    user_id: string
                    value: number | null
                }
                Insert: {
                    circle_kpi_id: number
                    created_at?: string
                    id?: number
                    period_id: number
                    user_id: string
                    value?: number | null
                }
                Update: {
                    circle_kpi_id?: number
                    created_at?: string
                    id?: number
                    period_id?: number
                    user_id?: string
                    value?: number | null
                }
                Relationships: [
                    {
                        foreignKeyName: 'audit_circle_kpi_id_fkey'
                        columns: ['circle_kpi_id']
                        referencedRelation: 'circle_kpi'
                        referencedColumns: ['id']
                    },
                    {
                        foreignKeyName: 'audit_period_id_fkey'
                        columns: ['period_id']
                        referencedRelation: 'period'
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
                    circle_id: number | null
                    created_at: string
                    id: number
                    kpi_id: number | null
                }
                Insert: {
                    circle_id?: number | null
                    created_at?: string
                    id?: number
                    kpi_id?: number | null
                }
                Update: {
                    circle_id?: number | null
                    created_at?: string
                    id?: number
                    kpi_id?: number | null
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
                    id: number
                    user_id: string
                }
                Insert: {
                    circle_id: number
                    created_at?: string
                    id?: number
                    user_id: string
                }
                Update: {
                    circle_id?: number
                    created_at?: string
                    id?: number
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