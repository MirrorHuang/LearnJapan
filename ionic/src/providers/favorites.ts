import { Injectable } from '@angular/core';

export interface FavoriteItem {
  lesson: string;
  idx: string;
  word: string;
  kana: string;
  kanji: string;
  desc: string;
  pos: string;
  savedAt: number;
}

export interface FavoritesStore {
  words: { [key: string]: FavoriteItem };
  grammar: { [key: string]: FavoriteItem };
}

@Injectable()
export class FavoritesProvider {
  private FAVORITES_KEY = 'favorites';
  private _favorites: FavoritesStore = { words: {}, grammar: {} };

  constructor() {
    this._load();
  }

  private _load() {
    try {
      const raw = localStorage.getItem(this.FAVORITES_KEY);
      const parsed = raw ? JSON.parse(raw) : null;
      this._favorites = parsed || { words: {}, grammar: {} };
      if (!this._favorites.words) this._favorites.words = {};
      if (!this._favorites.grammar) this._favorites.grammar = {};
    } catch (e) {
      this._favorites = { words: {}, grammar: {} };
    }
  }

  private _save() {
    localStorage.setItem(this.FAVORITES_KEY, JSON.stringify(this._favorites));
  }

  toggle(type: 'words' | 'grammar', item: FavoriteItem): void {
    const key = `${item.lesson}|${item.idx}`;
    if (this._favorites[type][key]) {
      delete this._favorites[type][key];
    } else {
      this._favorites[type][key] = Object.assign({}, item, { savedAt: Date.now() });
    }
    this._save();
  }

  isFav(type: 'words' | 'grammar', key: string): boolean {
    return !!this._favorites[type][key];
  }

  getAll(): FavoritesStore {
    return this._favorites;
  }

  remove(type: 'words' | 'grammar', key: string): void {
    delete this._favorites[type][key];
    this._save();
  }

  clearAll(): void {
    this._favorites = { words: {}, grammar: {} };
    this._save();
  }

  getAsWordlist(): any[] {
    return Object.keys(this._favorites.words).map(k => this._favorites.words[k]);
  }
}
