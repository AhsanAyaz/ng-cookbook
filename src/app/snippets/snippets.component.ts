import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-snippets',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './snippets.component.html',
  styleUrls: ['./snippets.component.scss']
})
export class SnippetsComponent implements OnInit {
  route = inject(ActivatedRoute);
  http = inject(HttpClient);
  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.getSnippet(id as string);
  }

  getSnippet(snippetId: string) {
    this.http.get<Record<string, string>>('/assets/snippets.json')
      .subscribe({
        next: (resp => {
          const redirectUrl = resp[snippetId];
          if (!redirectUrl) {
            alert("Wrong snippet Id. Please contact developer")
            return;
          }
          window.location.href = redirectUrl;
        })
      })
  }
}
