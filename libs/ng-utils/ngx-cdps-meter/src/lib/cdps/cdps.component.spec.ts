/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CdpsComponent } from './cdps.component';

describe('CdpsComponent', () => {
  let component: CdpsComponent;
  let fixture: ComponentFixture<CdpsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CdpsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CdpsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
