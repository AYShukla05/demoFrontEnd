import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { SubscriptionService } from '../subscriptions/subscriptions.service';
import { Post } from './post.model';
import { PostService } from './posts.service';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css']
})
export class PostsComponent implements OnInit {
  loading = true;
  isSubscribed!: boolean;
  searchQuery: string = '';
  isSearching = false;
  allPosts:Post[] = []
  popularPosts:Post[] = []
  subscribedPosts:Post[] = []
    // Pagination Controls
    page: any = 1;
    count: any = 6;
  constructor(private postService: PostService, 
  private subscriptionService: SubscriptionService,
   public authService: AuthService) { }

  ngOnInit(): void {
    this.isSubscribed = false
    this.postService.getPostsasync().subscribe(
      (response:{"Post":Post, "Vote":string}[]) => {
        this.allPosts= response.map(
          response=>{
            let tempPost:any = response['Post'];
            // tempPost.vote='None'
            tempPost.vote=response['Vote'];
            return tempPost}
            )
        this.allPosts.sort((a,b) =>b.vote_ratio - a.vote_ratio)
        this.popularPosts = this.allPosts
        this.loading=false
      this.postService.posts = this.allPosts
    }, (error)=>{
      this.authService.handleError(error)

    }
      )

  }
  search(){
    this.isSearching = true
    this.popularPosts = this.allPosts.filter(post => this.allPosts.map(post => post.title.toLocaleLowerCase())
    .filter(title => title.includes(this.searchQuery.toLowerCase())).includes(post.title.toLowerCase()))
  }
  onSubscribedPosts(){
    this.isSubscribed = true
    this.popularPosts = this.allPosts
    .filter
    ((post:Post) => 
      this.subscriptionService.subscribedUsers
      .map((post: { id: any; }) => post.id).includes(post.owner.id)
      )
  }

  
  onPopularPosts(){
    this.isSubscribed = false
    this.popularPosts = this.allPosts
  }

}
