import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL } from './api-url';

export interface Projeto {
  id?: number;
  nome: string;
  descricao: string;
  tecnologias: string;
  link_github: string;
  ano: number;
  status: 'rascunho' | 'publicado' | 'arquivado';
}

interface RespostaProjeto {
  id?: number;
  mensagem?: string;
}

@Injectable({ providedIn: 'root' })
export class ProjetoService {
  private http = inject(HttpClient);
  private url = `${API_URL}/projetos.php`;

  listar(todos = false): Observable<Projeto[]> {
    const url = todos ? `${this.url}?todos=1` : this.url;
    return this.http.get<Projeto[]>(url);
  }

  criar(projeto: Projeto): Observable<RespostaProjeto> {
    return this.http.post<RespostaProjeto>(this.url, projeto);
  }

  atualizar(id: number, projeto: Projeto): Observable<RespostaProjeto> {
    return this.http.put<RespostaProjeto>(`${this.url}?id=${id}`, projeto);
  }

  excluir(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}?id=${id}`);
  }
}
