import { MongoClient, Db, Collection } from "mongodb";
import { User } from "./user";
import { Note } from "./note";

export interface Table<T> extends Collection {
	__tableBrand: T;
}

const databaseUrl = "mongodb://localhost/notes";
const database = new Promise<Db>(resolve => {
	MongoClient.connect(databaseUrl, (error, db) => {
		if (error) {
			throw error;
		}
		resolve(db);
	})
});
async function getCollection<U>(name: string) {
	const db = await database;
	return <Table<U>> db.collection(name);
}
export const users = getCollection<User>("users");
export const notes = getCollection<Note>("notes");

export async function insert<U>(table: Promise<Table<U>>, item: U) {
	const collection = await table;
	return new Promise<void>((resolve, reject) => {
		collection.insertOne(item, (error) => {
			if (error) {
				reject(error);
			} else {
				resolve();
			}
		});
	});
}
export async function update<U extends V, V>(table: Promise<Table<U>>, query: V, newItem: U) {
	const collection = await table;
	return new Promise<void>((resolve, reject) => {
		collection.updateOne(query, newItem, (error) => {
			if (error) {
				reject(error);
			} else {
				resolve();
			}
		});
	});
}
export async function remove<U extends V, V>(table: Promise<Table<U>>, query: V) {
	const collection = await table;
	return new Promise<void>((resolve, reject) => {
		collection.deleteOne(query, (error) => {
			if (error) {
				reject(error);
			} else {
				resolve();
			}
		});
	});
}
export async function find<U extends V, V>(table: Promise<Table<U>>, query: V) {
	const collection = await table; 
	return new Promise<U[]>((resolve, reject) => {
		collection.find(query, (error, cursor) => {
			if (error) {
				reject(error);
			} else {
				cursor.toArray((error, results) => {
					if (error) {
						reject(error);
					} else {
						resolve(results);
					}
				});
			}
		});
	});
}
