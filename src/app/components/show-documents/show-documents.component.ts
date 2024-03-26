import { Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-show-documents',
  templateUrl: './show-documents.component.html',
  styleUrls: ['./show-documents.component.css']
})
export class ShowDocumentsComponent implements OnInit {
  documents_url:any;
  constructor(private route: ActivatedRoute, private renderer: Renderer2, private elementRef: ElementRef) { 
 
  }

  ngOnInit(): void {
    const newEmbed = this.renderer.createElement('embed');
    newEmbed.src = 'http://localhost:5000/api/files/' + this.route.snapshot.paramMap.get('id');
    this.renderer.addClass(newEmbed, 'myEmbed');
    this.renderer.setStyle(newEmbed, 'margin', 'auto');
    // this.renderer.setStyle(newEmbed, 'flex-direction', 'column');
    // this.renderer.setStyle(newEmbed, 'align-item', 'center');
    // this.renderer.setStyle(newEmbed, 'gap', '1rem');
    // this.renderer.setStyle(newEmbed, 'justify-content', 'center');
    this.renderer.appendChild(this.elementRef.nativeElement, newEmbed);
  }

}
