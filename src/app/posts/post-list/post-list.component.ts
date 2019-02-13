import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Post } from 'src/app/post.model';
import { PostsService } from '../posts.service';
import { Subscription } from 'rxjs';

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
  @Input() posts: Post[];
  private postSubscription = new Subscription();

  constructor( private postService: PostsService ) { }

  ngOnInit() {
    this.postService.getPosts();
    this.postSubscription = this.postService.getUpdatedPosts().subscribe(
      (posts) => this.posts = posts );
  }
  ngOnDestroy() {
    this.postSubscription.unsubscribe();
  }
}
