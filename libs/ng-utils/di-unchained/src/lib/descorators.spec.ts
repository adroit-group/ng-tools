/* eslint-disable @angular-eslint/component-selector */
import { ApplicationRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserModule } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { TestClass, TestComponent, TestModule } from './mocks/index';

describe('DI Unchained', () => {
  let fixture: ComponentFixture<TestComponent>;
  let component: TestComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BrowserModule, RouterTestingModule, TestModule],
    }).compileComponents();

    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it(`Decorated class should be able to use DI on static props and methods.`, () => {
    expect(TestClass.appRef).toBeInstanceOf(ApplicationRef);
    expect(TestClass.getRouter()).toBeInstanceOf(Router);
    expect(TestClass.routerFn()).toBeInstanceOf(Router);
  });

  it(`Decorated class should be able to create.`, () => {
    expect(component.myInstance).toBeDefined();
    expect(component.myInstance).toBeInstanceOf(TestClass);
  });

  it(`Decorated class should have it's instance members initialized.`, () => {
    expect(component.myInstance.router).toBeDefined();
    expect(component.myInstance.router).toBeInstanceOf(Router);
  });

  it(`Decorated class should have it's prototype members .`, () => {
    expect(component.myInstance.router).toBeDefined();
    expect(component.myInstance.router).toBeInstanceOf(Router);
  });
});
