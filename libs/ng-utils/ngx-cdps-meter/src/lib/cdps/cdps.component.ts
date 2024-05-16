/* eslint-disable @typescript-eslint/no-explicit-any */
import { CommonModule } from '@angular/common';
import { OnInit } from '@angular/core';
import {
  Component,
  DoCheck,
  ElementRef,
  Input,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'ad-cdps',
  templateUrl: './cdps.component.html',
  styleUrls: ['./cdps.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class CdpsComponent implements DoCheck, OnInit {
  @Input()
  public styles!: Record<string, any>;

  @ViewChild('cdCounter')
  public cdCounter!: ElementRef<HTMLDivElement>;

  private _counter = 0;

  cdps = 0;

  public ngOnInit(): void {
    setInterval(() => (this.cdps = 0), 1000);
  }

  public ngDoCheck(): void {
    if (this.cdCounter?.nativeElement) {
      this.cdCounter.nativeElement.innerHTML = `${this._counter++}`;
      this.cdps++;
    }
  }
}
