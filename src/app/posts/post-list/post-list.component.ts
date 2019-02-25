import { AuthService } from './../../auth/auth.service';
import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Post } from 'src/app/post.model';
import { PostsService } from '../posts.service';
import { Subscription } from 'rxjs';
import { PageEvent } from '@angular/material';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {

  // posts = [
  //   {title : 'First Post' , content : 'This is my first post'},
  //   {title : 'Second Post' , content : 'This is my second post'},
  //   {title : 'Third Post' , content : 'This is my third post'}
  // ];
  posts: Post[] = [];
  isLoading = false;
  totalPosts = 0;
  postsPerPage = 2;
  currentPage = 1;
  pageSizeOptions = [1, 2, 5, 10];
  isAuthenticated = false;
  private postSubscription = new Subscription();

  constructor( private postService: PostsService, private authService: AuthService ) { }
  userId: string;
  ngOnInit() {
    this.isLoading = true;
    this.userId = this.authService.getUserId();
    this.postService.getPosts(this.postsPerPage, 1);
    this.postSubscription = this.postService.getUpdatedPosts().subscribe(
      (postData: {posts: Post[], postCount: number}) => {
        this.isLoading = false;
        this.posts = postData.posts;
        this.totalPosts = postData.postCount;
      } );
    this.isAuthenticated = this.authService.getIsAuth();
    this.authService.getAuthStatus().subscribe((status) => {
      this.isAuthenticated = status;
      this.userId = this.authService.getUserId();
    });

  }
  ngOnDestroy() {
    this.postSubscription.unsubscribe();
  }
  onDelete(postID: string) {
    this.isLoading = true;
    this.postService.deletePost(postID)
    .subscribe(() => {
      this.postService.getPosts(this.postsPerPage, this.currentPage);
    }, () => {
      this.isLoading = false;
    });
  }

  onChangePage(pageData: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.postsPerPage = pageData.pageSize;
    this.postService.getPosts(this.postsPerPage, this.currentPage);
  }
}
