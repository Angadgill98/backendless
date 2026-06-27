export type InsertStruct={
    column_name:string
    value :any
    type?:any
    
}

export type WhereStruct={
    value :string
    type?:any 
}

export type Update_AppendStruct={
    column_name:string
    value :string[]
    type?:any 
}

export type ColumnScehma = {
  type: string
  [key: string]: any
  struct:any
};