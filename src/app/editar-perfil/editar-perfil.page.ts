/*Importação de módulos muito importantes para o funcionamento da aplicação. Nesta caso além das 
importaçãos padrão encontrads em todas as páginas foi importado um módulo para permissões de acesso 
à câmada do dispositivo*/
import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { ToastController } from '@ionic/angular';
import { Plugins } from '@capacitor/core';
import { CameraResultType, CameraSource } from '@capacitor/camera';
const { Camera, Permissions } = Plugins;

/*Importação de serviços para o funcionamento de funções, provenientes da pasta "services" do projeto */

import {
  LoadingController,
  AlertController,
  NavController,
} from '@ionic/angular';
import { createClient } from '@supabase/supabase-js';
import { DataService } from 'src/app/services/data.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-editar-perfil',
  templateUrl: './editar-perfil.page.html',
  styleUrls: ['./editar-perfil.page.scss'],
})

/*Exportação da classe abaixo com diversos campos, sendo o "formBuilder" não nulo, sendo assim uma verificação
de modo a não editar o perfil com informações a NULL, o que geraria erros na aplicação.
Todos os restantes atributo são arrays com uma "string" no seu interior guardando o respetivo texto.
Fora do grupo cujos dados não podem ser NULL, existem dados enviados (imagem de prfil) e o utilizador atualmente autenticado.*/
export class EditarPerfilPage {
  dadosAtualizados = this.fb.nonNullable.group({
    nome: [''],
    numero: [''],
    curso: [''],
    universidade: [''],
    imagem: [''],
  });
  uploadedFileName: string = '';
  users: any = null;
  user = this.authService.getCurrentUser();

  /*Construtor de todos os módulos importados no topo da página*/

  constructor(
    private fb: FormBuilder,
    private dataservice: DataService,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private navCtrl: NavController,
    private authService: AuthService,
    private toastController: ToastController,
    private translateService: TranslateService,
    private data: DataService
  ) {}

  /*Método para mudança de linguagem */

  onchangeLanguage(e: any) {
    this.translateService.use(e.target.value ? e.target.value : 'en');
  }

  /*dados estáticos dos cursos atuais disponíveis para os utilizadores da aplicação (ordenados por ordem alfabética (método sort().)).*/

  cursos = [
    'Engenharia Informática',
    'Engenharia Alimentar',
    'Enfermagem',
    'Turismo',
    'Contabilidade e Finanças',
    'Design Gráfico',
    'Marketing Digital',
    'Engenharia Civil',
    'Arquitetura',
    'Biomedicina',
    'Direito',
    'Psicologia',
    'Engenharia Mecânica',
    'Engenharia Eletrotécnica',
    'Engenharia de Produção',
    'Medicina Veterinária',
    'Ciências da Comunicação',
    'Gestão de Recursos Humanos',
    'Engenharia Química',
  ].sort();

  /*Getter para obter o valor proveniente da atualização dos dados (nome)*/

  get nome() {
    return this.dadosAtualizados.controls.nome;
  }

  /*Getter para obter o valor proveniente da atualização dos dados (curso)*/
  get curso() {
    return this.dadosAtualizados.controls.curso;
  }

  /*Getter para obter o valor proveniente da atualização dos dados (universidade)*/
  get universidade() {
    return this.dadosAtualizados.controls.universidade;
  }

  /*Getter para obter o valor proveniente da atualização dos dados (nmero)*/
  get numero() {
    return this.dadosAtualizados.controls.numero;
  }

  /*Método assíncrono que permite a abertura da câmara do dispositivo, esperando que a fotografia seja efetuada
  modificando também alguns dados importantes como a qualidade (de modo a poupar espaço dentro da base de dados).
  O método também verifica se existem permisões para aceder à câmara.*/

  async openCameraOrGallery(source: string) {
    try {
      const hasPermission = await this.checkCameraPermissions();
      if (!hasPermission) {
        throw new Error('Permissão negada para acessar a câmera ou a galeria.');
      }

      const image = await Plugins['Camera']['getPhoto']({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Uri,
        source: source === 'camera' ? CameraSource.Camera : CameraSource.Photos,
      });

      /* Upload da imagem para o Supabase, utilizando para tal o url da imagem (Supabase storage)*/
      const imageUrl = await this.dataservice.uploadImagemPerfil(image.path);

      /* Atualização dos dados do perfil do utilizador passado 
      como parâmetros o ID para confirmar o utilizador a ser atualizado */
      const userId = this.authService.getCurrentUserId();
      await this.authService.updateUserData({
        id: userId,
        imagem: imageUrl,
      });

      console.log('Perfil atualizado com sucesso.');

      /* Mostra um toast de sucesso  com a duração e 2 segundos (2000 milisegundos) e a cor verde de sucesso*/
      const successToast = await this.toastController.create({
        message: 'Perfil atualizado com sucesso!',
        duration: 2000,
        color: 'success',
      });

      /* Faz aparecer o toast após o o mesmo ser criado anteriormente, sobrepondo aos restantes elementos */
      await successToast.present();
    } catch (error) {
      console.error('Erro ao acessar a câmera ou a galeria:', error);
      /* Apresentação de informação de erros de acesso à câmera ou à galeria*/
      const errorToast = await this.toastController.create({
        message: 'Erro ao acessar a câmera ou a galeria. Tente novamente.',
        duration: 2000,
        color: 'danger',
      });

      /* Faz aparecer o toast após o o mesmo ser criado anteriormente, sobrepondo aos restantes elementos */

      await errorToast.present();
    }
  }

  /*Função assíncrona que verifica as permissões da câmara esprando pelas mesmas (autorização e await)*/

  async checkCameraPermissions() {
    const result = await Permissions['query']({ name: 'camera' });
    return result.state === 'granted';
  }

  async onAddButtonClick(source: string) {
    await this.openCameraOrGallery(source);
  }

  /*Função que transmite ao utilizador que está a ser carregada a sua informação */
  async updatePerfil() {
    const loading = await this.loadingController.create({
      message: 'Atualizando perfil...',
      spinner: 'circles',
      backdropDismiss: false,
    });

    try {
      await loading.present();

      const userId = this.authService.getCurrentUserId();
      const fileInput = document.getElementById(
        'imagemUpload'
      ) as HTMLInputElement;
      const file = fileInput.files?.[0];

      /* Inicializa a variável para armazenar a URL da imagem (supabase storage)*/
      let imageUrl: string | undefined;

      /* Se houver uma nova imagem selecionada, efetua o upload da imagem*/
      if (file) {
        imageUrl = await this.dataservice.uploadImagemPerfil(file);
      }

      /* Atualiza apenas os campos que foram modificados no formulário */
      const dadosAtualizados: any = {};
      Object.keys(this.dadosAtualizados.controls).forEach((key) => {
        const control = this.dadosAtualizados.get(key);
        if (control && control.dirty) {
          dadosAtualizados[key] = control.value;
        }
      });

      /* Se houver uma imagem nova ou outros campos modificados, atualiza o perfil (verifica o tamanho das strings se está vazia)*/
      if (file || Object.keys(dadosAtualizados).length > 0) {
        if (imageUrl) {
          dadosAtualizados.imagem = imageUrl;
        }

        /*Atualiza os dados do perfil no Supabase*/
        await this.authService.updateUserData({
          id: userId,
          ...dadosAtualizados,
        });

        console.log('Perfil atualizado com sucesso.');
        /* Mostra um toast de sucesso*/
        const successToast = await this.toastController.create({
          message: 'Perfil atualizado com sucesso!',
          duration: 2000,
          color: 'success',
        });
        await successToast.present();
      } else {
        /* Se nenhum arquivo de imagem for selecionado e nenhum outro dado for fornecido, mostra uma mensagem informativa de que nenhuma alteração foi feita*/
        console.log('Nenhuma alteração feita.');
        /* Mostra um toast informativo*/
        const infoToast = await this.toastController.create({
          message: 'Nenhuma alteração feita.',
          duration: 2000,
          color: 'warning',
        });
        await infoToast.present();
      }
    } catch (error) {
      console.error('Erro ao atualizar o perfil:', error);
      /* Mostra um toast de erro*/
      const errorToast = await this.toastController.create({
        message: 'Erro ao atualizar o perfil. Tente novamente.',
        duration: 2000,
        color: 'danger',
      });
      await errorToast.present();
    } finally {
      await loading.dismiss();
    }
  }

  /* Efetua o "upaload" da página indo ao array (? se existir) 
  na posição 0 buscando a respetiva string, utilizando operadores ternários.
  Os operadores ternários evitam o uso desnecessário de de (if's) e (elses's) */

  onImageUpload(event: any) {
    const fileInput = event.target as HTMLInputElement;
    this.uploadedFileName = fileInput.files?.[0]?.name ?? '';
  }

  /* Método para verificar se existe algum utilizador "logado". */

  async ionViewWillEnter() {
    const userId = this.authService.getCurrentUserId();
    if (userId) {
      this.users = await this.data.getUserById(userId);

      console.log('group: ', this.users);
    } else {
      console.log('Nenhum usuário autenticado encontrado.');
    }
  }
}
