import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { ItemDetailPage } from '../item-detail/item-detail';
import { Api, Items, FavoritesProvider } from '../../providers/providers';
import { Item } from '../../models/item';

@Component({
  selector: 'page-search',
  templateUrl: 'search.html'
})
export class SearchPage {
  currentItems: any = { words: [], grammar: [] };
  originItems: any;
  wordlimit = 9;
  grammarlimit = 9;
  wordsShowMore = true;
  grammarShowMore = true;

  constructor(public navCtrl: NavController, public navParams: NavParams, public items: Items, private favorites: FavoritesProvider) { }

  /**
   * Perform a service for the proper items.
   */
  getItems(ev) {
    this.wordlimit = 3;
    this.grammarlimit = 3;
    let val = ev.target.value;
    if (!val || !val.trim()) {
      this.currentItems = { words: [], grammar: [] };
      return;
    }
    this.items.queryLessons({ search: val }).subscribe(
      data => this.setItems(data),
      error => console.log(error));
  }

  setItems(items?) {
    if (items != undefined) {
      this.originItems = items;
    }
    this.currentItems = {
      words: this.originItems.words.slice(0, this.wordlimit),
      grammar: this.originItems.grammar.slice(0, this.grammarlimit),
    };
    this.wordsShowMore = this.wordlimit < this.originItems.words.length;
    this.grammarShowMore = this.grammarlimit < this.originItems.grammar.length;
  }

  moreGrammar() {
    this.grammarlimit += 5;
    this.setItems();
  }

  moreWords() {
    this.wordlimit += 5;
    this.setItems();
  }


  /**
   * Navigate to the detail page for this item.
   */
  openItem(item: Item) {
    this.navCtrl.push(ItemDetailPage, {
      item: item
    });
  }

  isWordFav(item: any): boolean {
    if (!item.idx || !item.lesson) return false;
    return this.favorites.isFav('words', `${item.lesson}|${item.idx}`);
  }

  isGrammarFav(item: any): boolean {
    if (!item.idx || !item.lesson) return false;
    return this.favorites.isFav('grammar', `${item.lesson}|${item.idx}`);
  }

  toggleWordFav(item: any) {
    this.favorites.toggle('words', {
      lesson: item.lesson || '',
      idx: item.idx || '',
      word: item.word || '',
      kana: item.kana || '',
      kanji: item.kanji || '',
      desc: item.desc || '',
      pos: item.pos || '',
      savedAt: 0
    });
  }

  toggleGrammarFav(item: any) {
    this.favorites.toggle('grammar', {
      lesson: item.lesson || '',
      idx: item.idx || '',
      word: item.expression || '',
      kana: '',
      kanji: '',
      desc: item.shortexplain || '',
      pos: '',
      savedAt: 0
    });
  }

}
