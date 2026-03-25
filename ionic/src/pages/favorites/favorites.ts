import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { FavoritesProvider, FavoriteItem } from '../../providers/favorites';
import { RecitePage } from '../recite/recite';
import { ItemDetailPage } from '../item-detail/item-detail';

@Component({
  selector: 'page-favorites',
  templateUrl: 'favorites.html'
})
export class FavoritesPage {
  segment: string = 'words';
  favoriteWords: FavoriteItem[] = [];
  favoriteGrammar: FavoriteItem[] = [];

  constructor(public navCtrl: NavController, private favorites: FavoritesProvider) {}

  ionViewWillEnter() {
    this.loadFavorites();
  }

  loadFavorites() {
    const all = this.favorites.getAll();
    this.favoriteWords = Object.keys(all.words)
      .map(k => all.words[k])
      .sort((a, b) => b.savedAt - a.savedAt);
    this.favoriteGrammar = Object.keys(all.grammar)
      .map(k => all.grammar[k])
      .sort((a, b) => b.savedAt - a.savedAt);
  }

  startRecite() {
    const wordlist = this.favorites.getAsWordlist();
    this.navCtrl.push(RecitePage, {
      item: wordlist,
      lesson: '收藏词',
      fromFavorites: true
    });
  }

  removeWord(item: FavoriteItem) {
    this.favorites.remove('words', `${item.lesson}|${item.idx}`);
    this.loadFavorites();
  }

  removeGrammar(item: FavoriteItem) {
    this.favorites.remove('grammar', `${item.lesson}|${item.idx}`);
    this.loadFavorites();
  }

  openWord(item: FavoriteItem) {
    this.navCtrl.push(ItemDetailPage, { item });
  }

  openGrammar(item: FavoriteItem) {
    this.navCtrl.push(ItemDetailPage, { item });
  }
}
