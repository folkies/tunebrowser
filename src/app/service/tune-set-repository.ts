/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable, inject } from '@angular/core';
import { TuneSet, TuneSetCollection } from '../model/tune-set';
import { GoogleDriveService, TUNE_FOLDER } from './google-drive.service';
import { TuneReference } from '../model/repertoire';

const TUNE_SETS_FILE = 'tune-sets.json';
export const MAX_TUNES_PER_SET = 5;

/**
 * Reviver function for JSON.parse() to handle Date objects and migration.
 */
export function reviveTuneSet(key: string, value: any): any {
    if (key === 'created' || key === 'modified') {
        return new Date(value);
    }
    // Ensure tags field exists for backward compatibility
    if (key === 'sets' && Array.isArray(value)) {
        return value.map((set: any) => ({
            ...set,
            tags: set.tags || []
        }));
    }
    return value;
}

/**
 * Repository for tune sets. Uses Google Drive for storage.
 */
@Injectable()
export class TuneSetRepository {
    private googleDrive = inject(GoogleDriveService);

    /** Google Drive file ID of the tune sets collection. */
    private collectionFileId: string;

    /** Loaded tune set collection. */
    private tuneSetCollection: TuneSetCollection;

    /**
     * Loads all tune sets.
     * @return tune set collection.
     */
    async load(): Promise<TuneSetCollection> {
        if (!await this.googleDrive.isSignedIn()) {
            return { sets: [] };
        }

        if (this.tuneSetCollection) {
            return this.tuneSetCollection;
        }

        const folderId = await this.googleDrive.findOrCreateFolder(TUNE_FOLDER);
        const fileRefs = await this.googleDrive.listTextFiles(folderId);
        const collectionRef = fileRefs.find(ref => ref.name === TUNE_SETS_FILE);
        let collectionJson: string;
        if (collectionRef === undefined) {
            collectionJson = '{"sets": []}';
            this.collectionFileId = await this.googleDrive.createTextFile(TUNE_SETS_FILE, collectionJson);
        } else {
            this.collectionFileId = collectionRef.id;
            collectionJson = await this.googleDrive.getTextFile(collectionRef.id);
        }

        this.tuneSetCollection = JSON.parse(collectionJson, reviveTuneSet);
        return this.tuneSetCollection;
    }

    /**
     * Saves the tune set collection to Google Drive.
     */
    async save(): Promise<void> {
        const collectionJson = JSON.stringify(this.tuneSetCollection, null, 2);
        await this.googleDrive.updateTextFile(this.collectionFileId, collectionJson);
    }

    /**
     * Creates a new tune set.
     * @param name name of the set
     * @param tags optional tags for the set
     * @return the created tune set
     */
    async createSet(name: string, tags: string[] = []): Promise<TuneSet> {
        await this.load();
        const now = new Date();
        const newSet: TuneSet = {
            id: this.generateId(),
            name,
            tunes: [],
            tags: tags || [],
            created: now,
            modified: now
        };
        this.tuneSetCollection.sets.push(newSet);
        await this.save();
        return newSet;
    }

    /**
     * Updates an existing tune set.
     * @param set the tune set to update
     */
    async updateSet(set: TuneSet): Promise<void> {
        await this.load();
        const index = this.tuneSetCollection.sets.findIndex(s => s.id === set.id);
        if (index !== -1) {
            set.modified = new Date();
            this.tuneSetCollection.sets[index] = set;
            await this.save();
        }
    }

    /**
     * Deletes a tune set.
     * @param setId ID of the set to delete
     */
    async deleteSet(setId: string): Promise<void> {
        await this.load();
        this.tuneSetCollection.sets = this.tuneSetCollection.sets.filter(s => s.id !== setId);
        await this.save();
    }

    /**
     * Adds a tune to a set.
     * @param setId ID of the set
     * @param tune tune reference to add
     */
    async addTuneToSet(setId: string, tune: TuneReference): Promise<void> {
        await this.load();
        const set = this.tuneSetCollection.sets.find(s => s.id === setId);
        if (set && set.tunes.length < MAX_TUNES_PER_SET) {
            set.tunes.push(tune);
            set.modified = new Date();
            await this.save();
        }
    }

    /**
     * Removes a tune from a set.
     * @param setId ID of the set
     * @param tuneIndex index of the tune to remove
     */
    async removeTuneFromSet(setId: string, tuneIndex: number): Promise<void> {
        await this.load();
        const set = this.tuneSetCollection.sets.find(s => s.id === setId);
        if (set && tuneIndex >= 0 && tuneIndex < set.tunes.length) {
            set.tunes.splice(tuneIndex, 1);
            set.modified = new Date();
            await this.save();
        }
    }

    /**
     * Reorders tunes in a set.
     * @param setId ID of the set
     * @param oldIndex current index of the tune
     * @param newIndex new index for the tune
     */
    async reorderTunesInSet(setId: string, oldIndex: number, newIndex: number): Promise<void> {
        await this.load();
        const set = this.tuneSetCollection.sets.find(s => s.id === setId);
        if (set && oldIndex >= 0 && oldIndex < set.tunes.length && newIndex >= 0 && newIndex < set.tunes.length) {
            const [tune] = set.tunes.splice(oldIndex, 1);
            set.tunes.splice(newIndex, 0, tune);
            set.modified = new Date();
            await this.save();
        }
    }

    /**
     * Gets a tune set by ID.
     * @param setId ID of the set
     * @return the tune set or undefined if not found
     */
    async getSet(setId: string): Promise<TuneSet | undefined> {
        await this.load();
        return this.tuneSetCollection.sets.find(s => s.id === setId);
    }

    /**
     * Generates a unique ID for a new set.
     * @return unique ID
     */
    private generateId(): string {
        if (!this.tuneSetCollection || this.tuneSetCollection.sets.length === 0) {
            return '1';
        }
        
        // Find the highest numeric ID
        const maxId = this.tuneSetCollection.sets.reduce((max, set) => {
            const numId = parseInt(set.id, 10);
            return !isNaN(numId) && numId > max ? numId : max;
        }, 0);
        
        return (maxId + 1).toString();
    }
}
