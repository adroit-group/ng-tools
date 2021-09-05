import { Node, NodeArray } from 'typescript';

export function asNodeArray<T extends Node>(value: T[] | NodeArray<T>): T[] {
  return !!value && Array.isArray(value) ? value : [];
}
