import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Projeto, ProjetoService } from '../projeto.service';

@Component({
  selector: 'app-gestao',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './gestao.html',
  styleUrl: './gestao.css'
})
export class Gestao implements OnInit {
  private service = inject(ProjetoService);

  projetos: Projeto[] = [];
  carregando = true;
  salvando = false;
  excluindoId: number | null = null;
  editandoId: number | null = null;
  erro = '';
  sucesso = '';

  form = new FormGroup({
    nome: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(3)]
    }),
    descricao: new FormControl('', { nonNullable: true }),
    tecnologias: new FormControl('', { nonNullable: true }),
    link_github: new FormControl('', { nonNullable: true }),
    ano: new FormControl(2026, {
      nonNullable: true,
      validators: [Validators.required, Validators.min(2000), Validators.max(2100)]
    }),
    status: new FormControl<'rascunho' | 'publicado'>('publicado', {
      nonNullable: true,
      validators: [Validators.required]
    })
  });

  ngOnInit() {
    this.carregar();
  }

  carregar() {
    this.carregando = true;
    this.erro = '';

    this.service.listar(true).subscribe({
      next: (lista) => {
        this.projetos = lista;
        this.carregando = false;
      },
      error: () => {
        this.erro = 'Não foi possível carregar os projetos.';
        this.carregando = false;
      }
    });
  }

  editar(projeto: Projeto) {
    this.editandoId = projeto.id ?? null;
    this.sucesso = '';
    this.erro = '';

    this.form.patchValue({
      nome: projeto.nome,
      descricao: projeto.descricao,
      tecnologias: projeto.tecnologias,
      link_github: projeto.link_github,
      ano: projeto.ano,
      status: projeto.status === 'rascunho' ? 'rascunho' : 'publicado'
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  cancelarEdicao() {
    this.limparFormulario();
  }

  salvar() {
    this.sucesso = '';
    this.erro = '';

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.salvando = true;

    const dados: Projeto = {
      ...this.form.getRawValue()
    };

    const requisicao = this.editandoId
      ? this.service.atualizar(this.editandoId, dados)
      : this.service.criar(dados);

    requisicao.subscribe({
      next: () => {
        this.sucesso = this.editandoId
          ? 'Projeto atualizado com sucesso.'
          : 'Projeto adicionado com sucesso.';

        this.salvando = false;
        this.limparFormulario(false);
        this.carregar();
      },
      error: () => {
        this.salvando = false;
        this.erro = 'Não foi possível salvar o projeto. Tente novamente.';
      }
    });
  }

  excluir(projeto: Projeto) {
    if (!projeto.id) {
      return;
    }

    const confirmou = confirm(
      `Excluir o projeto "${projeto.nome}"? Esta ação não pode ser desfeita.`
    );

    if (!confirmou) {
      return;
    }

    this.erro = '';
    this.sucesso = '';
    this.excluindoId = projeto.id;

    this.service.excluir(projeto.id).subscribe({
      next: () => {
        this.projetos = this.projetos.filter((item) => item.id !== projeto.id);
        this.excluindoId = null;
        this.sucesso = 'Projeto excluído com sucesso.';

        if (this.editandoId === projeto.id) {
          this.limparFormulario(false);
        }
      },
      error: () => {
        this.excluindoId = null;
        this.erro = 'Não foi possível excluir o projeto. Tente novamente.';
      }
    });
  }

  private limparFormulario(limparMensagens = true) {
    this.editandoId = null;

    this.form.reset({
      nome: '',
      descricao: '',
      tecnologias: '',
      link_github: '',
      ano: 2026,
      status: 'publicado'
    });

    if (limparMensagens) {
      this.erro = '';
      this.sucesso = '';
    }
  }
}
