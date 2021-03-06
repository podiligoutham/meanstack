import { Injectable } from '@angular/core';
import { Post } from '../post.model';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

const BACKEND_URL = environment.apiURL + '/posts/';

@Injectable({
  providedIn: 'root'
})
export class PostsService {
  posts: Post[] = [];
  private postSubject = new Subject<{posts: Post[], postCount: number}>();

  constructor(private http: HttpClient, private router: Router) { }
  getPosts(postsPerPage: number, currentPage: number) {
    const queryParams = `?pageSize=${postsPerPage}&currentPage=${currentPage}`;
    this.http.get<{message: string, posts: any, maxPosts: number}>(BACKEND_URL + queryParams)
    .pipe( map(postData => {
      return {posts: postData.posts.map(post => {
        return{
          title: post.title,
          content: post.content,
          id: post._id,
          imagePath: post.imagePath,
          creator: post.creator
        };
      }), maxPosts: postData.maxPosts};
    } ) )
    .subscribe((postsData) => {
      this.posts = postsData.posts;
      this.postSubject.next({posts: [...this.posts], postCount: postsData.maxPosts});
    });
  }

  getUpdatedPosts() {
    return this.postSubject.asObservable();
  }

  addPost(title: string, content: string, image: File ) {
    const postData = new FormData();
    postData.append('title', title);
    postData.append('content', content);
    postData.append('image', image, title);
    this.http.post<{message: string , post: Post}>(BACKEND_URL, postData)
    .subscribe((res) => {
    this.router.navigate(['/']);
    });
  }

  updatePost(id: string, title: string, content: string, image: File | string) {
    let postData;
    if (typeof(image) === 'object') {
      postData = new FormData();
      postData.append('id' , id);
      postData.append('title', title);
      postData.append('content', content);
      postData.append('image', image, title);
    } else {
       postData = {id, title, content, imagePath: image, creator: null};
    }
    this.http.put(BACKEND_URL + id , postData )
    .subscribe((res) => {
      this.router.navigate(['/']);
    });
  }

  deletePost(id: string) {
    return this.http.delete(BACKEND_URL + id);
  }
// 6869B  5116  5016
  getPost(id: string) {
    return this.http.get<{id: string, title: string, content: string, imagePath: string, creator: string}>
     (BACKEND_URL + id);
  }

}
