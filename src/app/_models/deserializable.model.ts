export interface Deserializable {
    deserialize(input: any, type:string): this;
}