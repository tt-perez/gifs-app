import { HttpClient } from '@angular/common/http';
import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { environment } from '@environments/environment';
import type { GiphyResponse } from '../interfaces/giphy.interfaces';
import { Gif } from '../interfaces/gif.interface';
import { GifsMapper } from '../mapper/gifs.mapper';
import { map, tap } from 'rxjs';

const GIF_KEY = 'gifs';

const loadFromLocalStorge = () =>{
  const gifsFromLocalStorage = localStorage.getItem(GIF_KEY) ?? '{}';
  const gifs = JSON.parse(gifsFromLocalStorage);

  return gifs;
}
@Injectable({
  providedIn: 'root'
})
export class GifsService {
 private http = inject(HttpClient);
 trendingGifs = signal<Gif[]>([]);
 trendingGifsLoading = signal(true);

 searchHistory = signal <Record<string, Gif[]>> (loadFromLocalStorge());
 searchHistoryKey = computed(()=> Object.keys(this.searchHistory()))

 constructor(){
  this.loadTrendingGifs();
 }

 saveHistorytoLocalStorage = effect(()=>{
  const histroryString = JSON.stringify(this.searchHistory());
  localStorage.setItem(GIF_KEY,histroryString);
 })
 
  loadTrendingGifs(){
    this.http.get<GiphyResponse>(`${environment.giphyUrl}/gifs/trending`, {
      params: {
       api_key: environment.giphyApikey,
       limit: 20,
      }
    }).subscribe((resp)=>{
     const gifs = GifsMapper.mapGiphyItemtoGifArray(resp.data);
     this.trendingGifs.set(gifs);
     this.trendingGifsLoading.set(false);
     console.log(gifs);
    })
  }
  searchGifs(query:string){
      return this.http.get<GiphyResponse>(`${environment.giphyUrl}/gifs/search`, {
      params: {
       api_key: environment.giphyApikey,
       limit: 20,
       q: query,
      }
    }).pipe(
      map(({data})=> data),
      map((items)=> GifsMapper.mapGiphyItemtoGifArray(items)),
      tap( items => {
        this.searchHistory.update(history => ({
          ...history,
          [query.toLowerCase()] : items,
        }))
      })
    );

   
   
   
    /*.subscribe((resp)=>{
     const gifs = GifsMapper.mapGiphyItemtoGifArray(resp.data);

     console.log({search: gifs});
    })*/
  }

  getHistorygifs(query:string): Gif[]{
    return this.searchHistory()[query] ?? [];
  }

}
