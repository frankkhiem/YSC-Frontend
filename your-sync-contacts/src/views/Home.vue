<template>
<div>
<!-- tml khanh -->
  <div class="contacts container-fluid">
    <div class="row">
      <!-- phần nav 3 loại danh bạ -->
      <div class="col-3">
        <div class="nav flex-column nav-pills menu p-4" id="v-pills-tab" role="tablist" aria-orientation="vertical">
          <a @click="typeContacts = 'YSC'" class="nav-link py-3" :class="[typeContacts === 'YSC' ? 'active' : '']" id="v-pills-ysc-contact-tab btn" data-toggle="pill"  role="tab" aria-controls="v-pills-ysc-contact" aria-selected="true"><i class="fas fa-address-book"></i>&nbsp;&nbsp;&nbsp;YSC CONTACTS</a>
          <a @click="typeContacts = 'google'" class="nav-link py-3" :class="[typeContacts === 'google' ? 'active' : '']" id="v-pills-gg-contact-tab btn" data-toggle="pill" role="tab" aria-controls="v-pills-gg-contact" aria-selected="false"><i class="fab fa-google"></i>&nbsp;&nbsp;GOOGLE CONTACTS</a>
          <a @click="typeContacts = 'outlook'" class="nav-link py-3" :class="[typeContacts === 'outlook' ? 'active' : '']" id="v-pills-outlook-contact-tab btn" data-toggle="pill" role="tab" aria-controls="v-pills-outlook-contact" aria-selected="false"><i class="fab fa-microsoft"></i>&nbsp;&nbsp;OUTLOOK CONTACTS</a>
        </div>
      </div>

      <!-- phần bảng 3 loại danh bạ -->
      <div class="col-5">
        <div class="tab-content" id="v-pills-tabContent">
          <div class="tab-pane fade show active" id="v-pills-ysc-contact" role="tabpanel" aria-labelledby="v-pills-ysc-contact-tab">
          <!-- paste cái bảng ysc-contact vào đây.chỉnh sửa tý cho giốngcái bảng mẫu ysc-contact. paste xong nhớ bảng ví dụ xóa đi -->

            <!-- syncontact-->
            <div v-if="typeContacts === 'YSC'" class="container-xl" style="padding-top: 25px;">
              <div class="table-responsive" style="margin: auto;">
                <div class="table-wrapper">
                  <div class="table-title">
                    <div class="row">
                      <div class="col-sm-7">
                        <b style="font-size:24px; float:left;">YSC Contacts</b>
                        <a @click="handleModalCreate()" class="btn btn-success" data-toggle="modal" style="float: left;"><i class="material-icons">&#xE147;</i> <span>Thêm liên lạc</span></a>
                        <a v-show="checkedContacts.length != 0" @click="deleteMultipleContacts" class="btn btn-danger" data-toggle="modal" style="float: left;">
                          <i class="material-icons">&#xE15C;</i>
                          <span>Xóa liên lạc</span>
                        </a>                                
                      </div>
                      <div class="col-sm-5">     
                        <a @click="sync" class="btn btn-info" data-toggle="modal">
                          <i class="fas fa-sync"></i> 
                          <span>Đồng bộ</span>
                        </a>
                        <a @click="refreshYSCContacts()" class="btn btn-primary" data-toggle="modal">
                          <i class="fas fa-redo-alt"></i> 
                          <span>Làm mới</span>
                        </a>                             
                      </div>
                    </div>
                  </div>
                  <div style="text-align: center; margin: 14px 0 12px;">
                    <span v-if="syncContacts.data.syncAt">
                      <b>Đồng bộ lần cuối vào: {{ syncContacts.data.syncAt.toLocaleString() }}</b>
                    </span>
                    <span v-else>
                      <b>Chưa từng được đồng bộ!</b>
                    </span>
                  </div>
                  <div class="table-scroll"> 
                    <table class="table table-striped table-hover">
                      <thead class="listcontact">
                        <tr>
                          <th>
                            <span class="custom-checkbox">
                              <input type="checkbox" id="selectAll" class="contacts-checkbox" ref="selectAll" @click="selectAll()" v-model="allSelected">
                              <label for="selectAll"></label>
                            </span>
                          </th>
                          <th>
                            Tên liên lạc
                            <span v-if="!syncContacts.loading" class="count-contacts">
                              <span v-if="checkedContacts.length > 0">
                                ({{checkedContacts.length}}/{{syncContacts.data.contacts.length}})
                              </span>
                              <span v-else>
                                ({{ syncContacts.data.contacts.length }})
                              </span>
                            </span>
                          </th>
                          <th>Thao tác</th>
                        </tr>
                      </thead>
                      <tbody v-if="!syncContacts.loading">
                        <tr 
                          v-for="(contact, index) in syncContacts.data.contacts" 
                          :key="index" 
                          class="dropdown"
                        >
                          <td>
                            <span class="custom-checkbox">
                              <input type="checkbox" id="checkbox1" class="contacts-checkbox" :value="contact.phoneName" v-model="checkedContacts" checked>
                              <label for="checkbox1"></label>
                            </span>
                          </td>
                          <td @click="showContact(index)">
                            <div 
                              class="dropdown-toggle" 
                              :class="[showContacts[index] ? 'reverse' : '' ]"
                            >
                              {{ contact.phoneName }}
                            </div>
                            <div v-show="showContacts[index]" class="phone-numbers"> 
                              <div @click.stop>Thông tin liên hệ</div>
                              <ul>
                                <li 
                                  v-for="(phoneNumber, index) in contact.phoneNumbers"
                                  :key="index" 
                                  @click.stop
                                >
                                  <a class="phone-number__item" :href="`tel:${phoneNumber}`">
                                    {{ phoneNumber }}
                                  </a>
                                </li>
                              </ul>
                            </div>
                          </td>
                          <td>
                            <a class="edit"  data-toggle="modal"><i @click="handleModalEdit(contact)" class="material-icons" data-toggle="tooltip" title="Edit">&#xE254;</i></a>
                            <a class="delete" data-toggle="modal"><i @click="deleteContact(contact.phoneName)" class="material-icons" data-toggle="tooltip" title="Delete">&#xE872;</i></a>
                          </td>
                        </tr>
                      </tbody>
                      <img v-else class="loading-contacts" src="@/assets/img/Spin-2s-204px.gif">
                    </table>
                  </div>
                </div>
              </div>

              <!-- Modal create contact -->
              <div id="addEmployeeModal" v-if="showModalCreate">
                <div class="modal-dialog">
                  <div class="modal-content">
                    <form @submit="createContact">
                      <div class="modal-header">            
                        <h4 class="modal-title">Tạo liên hệ</h4>
                        <button type="button" @click="showModalCreate = false" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                      </div>
                      <div class="modal-body">          
                        <div class="form-group">
                          <label>Tên</label>
                          <input type="text" class="form-control" v-model="newContact.phoneName" required>
                        </div>
                        <div class="form-group">
                          <label style="padding-right: 7px;">Số điện thoại</label> 
                          <i @click="addPhoneNumber++" class="fas fa-plus-circle"></i>
                          <i v-if="addPhoneNumber > 0" @click="addPhoneNumber--; newContact.phoneNumbers.splice(0, 1);" class="fas fa-minus-circle" style="float: right; margin-top: 36px;"></i>
                          <input type="text" name="phoneName" class="form-control" v-model="newContact.phoneNumbers[0]" required>
                        </div>
                        <div v-for="index in addPhoneNumber" :key="index" class="form-group">
                          <i @click="addPhoneNumber--; newContact.phoneNumbers.splice(index, 1);" class="fas fa-minus-circle" style="float: right; margin-top: 9px;"></i>
                          <input type="text" class="form-control" v-model="newContact.phoneNumbers[index]" required>
                        </div>            
                      </div>
                      <div class="modal-footer">
                        <input 
                          @click="showModalCreate = false"
                          type="button" 
                          class="btn btn-default" 
                          data-dismiss="modal" value="Cancel"
                        >
                        <input type="submit" class="btn btn-info" value="Save">
                      </div>
                    </form>
                  </div>
                </div>
              </div>
              <!-- Edit Modal HTML -->
              <div id="editEmployeeModal" v-if="showModalEdit">
                <div class="modal-dialog">
                  <div class="modal-content">
                    <form @submit="updateContact">
                      <div class="modal-header">            
                        <h4 class="modal-title">Chỉnh sửa liên hệ</h4>
                        <button type="button" @click="showModalEdit=false" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                      </div>
                      <div class="modal-body">          
                        <div class="form-group">
                          <label>Tên</label>
                          <input type="text" class="form-control" required v-model="oldContact.newPhoneName">
                        </div>
                        <div>
                          <label style="padding-right: 7px;">Số điện thoại</label> 
                          <i @click="addPhoneNumberEdit++" class="fas fa-plus-circle"></i>
                        </div>
                        <div v-for="index in addPhoneNumberEdit" :key="index" class="form-group">
                          <i v-if="index != 1 || addPhoneNumberEdit > 1" @click="addPhoneNumberEdit--; oldContact.phoneNumbers.splice(index-1, 1);" class="fas fa-minus-circle" style="float: right; margin-top: 9px;"></i>
                          <input type="text" class="form-control" v-model="oldContact.phoneNumbers[index-1]" required>
                        </div>            
                      </div>
                      <div class="modal-footer">
                        <input @click="showModalEdit=false;" type="button" class="btn btn-default" data-dismiss="modal" value="Cancel">
                        <input type="submit" class="btn btn-info" value="Save">
                      </div>
                    </form>
                  </div>
                </div>
              </div>         
            </div>

            <!-- Google contacts -->
            <div v-if="typeContacts === 'google'" class="container-xl" style="padding-top: 25px;">
              <div class="table-responsive" style="margin: auto;">
                <div class="table-wrapper">
                  <div class="table-title" style="background-color: #cf6a68;">
                    <div class="row">
                      <div class="col-sm-7">
                        <b style="font-size:24px; float:left;">Google Contacts</b>
                      </div>
                      <div class="col-sm-5">            
                        <a @click="syncReverseGoogle" class="btn btn-info" data-toggle="modal"><i class="fas fa-sync"></i> <span>Đồng bộ ngược</span></a>
                        <a @click="refreshGoogleContacts()" class="btn btn-primary" data-toggle="modal"><i class="fas fa-redo-alt"></i> <span>Làm mới</span></a>                          
                      </div>
                    </div>
                  </div>
                  <div class="table-scroll"> 
                    <table class="table table-striped table-hover">
                      <thead class="listcontact">
                        <tr>
                          <th>
                            Tên liên lạc
                            <span v-if="!googleContacts.loading && googleContacts.linked" class="count-contacts">
                              ({{ googleContacts.data.length }})
                            </span>
                          </th>
                        </tr>
                      </thead>
                      <div v-if="!googleContacts.loading && !googleContacts.linked" class="not-linked">
                        <div class="not-linked__message">
                          Bạn chưa liên kết với tài khoản Google của mình!
                        </div>
                        <router-link :to="{name: 'Profile'}" class="not-linked__link">
                          &raquo;&nbsp;đi tới Cài đặt
                        </router-link>
                      </div>
                      <tbody v-if="!googleContacts.loading && googleContacts.linked">
                        <tr v-for="(contact, index) in googleContacts.data" :key="index" class="dropdown" >
                          <td @click="showContact(index)">
                            <div 
                              class="dropdown-toggle" 
                              :class="[showContacts[index] ? 'reverse' : '' ]"
                            >
                              {{ contact.phoneName }}
                            </div>
                            <div v-show="showContacts[index]" class="phone-numbers"> 
                              <div @click.stop>Thông tin liên hệ</div>
                              <ul>
                                <li 
                                  v-for="(phoneNumber, index) in contact.phoneNumbers"
                                  :key="index"
                                  @click.stop
                                >
                                  <a class="phone-number__item" :href="`tel:${phoneNumber}`">
                                    {{ phoneNumber }}
                                  </a>
                                </li>
                              </ul>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                      <img v-if="googleContacts.loading" class="loading-contacts" src="@/assets/img/Spin-2s-204px.gif">
                    </table>
                  </div>
                </div>
              </div>      
            </div>

            <!-- Outlook Contacts -->
            <div v-if="typeContacts === 'outlook'" class="container-xl" style="padding-top: 25px;">
              <div class="table-responsive" style="margin: auto;">
                <div class="table-wrapper">
                  <div class="table-title" style="background-color: #65c556">
                    <div class="row">
                      <div class="col-sm-7">
                        <b style="font-size:24px; float:left;">Outlook Contacts</b>                      
                      </div>
                      <div class="col-sm-5">            
                        <a @click="syncReverseOutlook" class="btn btn-info" data-toggle="modal"><i class="fas fa-sync"></i> <span>Đồng bộ ngược</span></a>
                        <a @click="refreshOutlookContacts()" class="btn btn-primary" data-toggle="modal"><i class="fas fa-redo-alt"></i> <span>Làm mới</span></a>                         
                      </div>
                    </div>
                  </div>
                  <div class="table-scroll"> 
                    <table class="table table-striped table-hover">
                      <thead class="listcontact">
                        <tr>
                          <th>
                            Tên liên lạc
                            <span v-if="!outlookContacts.loading && outlookContacts.linked" class="count-contacts">
                              ({{ outlookContacts.data.length }})
                            </span>
                          </th>
                        </tr>
                      </thead>
                      <div v-if="!outlookContacts.loading && !outlookContacts.linked" class="not-linked">
                        <div class="not-linked__message">
                          Bạn chưa liên kết với tài khoản Outlook của mình!
                        </div>
                        <router-link :to="{name: 'Profile'}" class="not-linked__link">
                          &raquo;&nbsp;đi tới Cài đặt
                        </router-link>
                      </div>
                      <tbody v-if="!outlookContacts.loading && outlookContacts.linked">
                        <tr v-for="(contact, index) in outlookContacts.data" :key="index" class="dropdown" >
                          <td @click="showContact(index)">
                            <div 
                              class="dropdown-toggle" 
                              :class="[showContacts[index] ? 'reverse' : '' ]"
                            >
                              {{ contact.phoneName }}
                            </div>
                            <div v-show="showContacts[index]" class="phone-numbers"> 
                              <div @click.stop>Thông tin liên hệ</div>
                              <ul>
                                <li 
                                  v-for="(phoneNumber, index) in contact.phoneNumbers"
                                  :key="index"
                                  @click.stop
                                >
                                  <a class="phone-number__item" :href="`tel:${phoneNumber}`">
                                    {{ phoneNumber }}
                                  </a>
                                </li>
                              </ul>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                      <img v-if="outlookContacts.loading" class="loading-contacts" src="@/assets/img/Spin-2s-204px.gif">
                    </table>
                  </div>
                </div>
              </div>      
            </div>

          </div>
        </div>
      </div>
      <!-- hết phần bảng 3 loại danh bạ -->
    </div>
  </div>
  <!-- tml khanh -->
  <!-- popup custom confirm -->
  <div v-show="showConfirmPopup" class="confirm">
    <div class="confirm-popup">
      <div class="confirm-message">
        {{ confirmMessage }}
      </div>
      <div class="confirm-btns">
        <div class="cancel-btn">
          Hủy
        </div>
        <div class="agree-btn">
          Xóa
        </div>
      </div>
    </div>
  </div>
</div>  
</template>
<script>
import { mapGetters } from 'vuex';
import axios from 'axios';

export default {
  data() {
    return {
      addPhoneNumber: 0, 
      addPhoneNumberEdit: 0,
      showModalEdit: false,
      showModalCreate: false,
      checkedContacts: [],
      allSelected: false,
      showContacts: [],
      typeContacts: 'YSC',  
      syncContacts: {
        loading: false,
        data: {}
      },
      googleContacts: {
        loading: false,
        linked: false,
        data: []
      },
      outlookContacts: {
        loading: false,
        linked: false,
        data: []
      },
      // Crud contact
      newContact: {
        phoneName: '',
        phoneNumbers: []
      },
      oldContact: {
        oldPhoneName: '',
        newPhoneName: '',
        phoneNumbers: []
      },
      // custom confirm
      showConfirmPopup: false,
      confirmMessage: '',
    }
  }, 
  
  computed: {
    ...mapGetters({
      user: 'profile',
      auth: 'userAuthenticated'
    }),
  },

  methods: {
    showContact(index) {
      this.$set(this.showContacts, index, !this.showContacts[index]);
    },

    async sync() {
      console.log('Dong bo danh ba nguoi dung');
      this.syncContacts.loading = true;

      try {
        await axios.get(this.$backendHost + '/sync-contacts', {
          params: {
            accessToken: localStorage.getItem('accessToken')
          }
        });
      } catch(error) {
        console.log(error.response.data);
      }

      this.refreshYSCContacts();
    },

    async loadContacts(type) {
      if( type === 'google' ) {
        // console.log('Load danh ba Google');

        try {
          await axios.post(this.$backendHost + '/google/load-contacts', {
            accessToken: localStorage.getItem('accessToken')
          });
          this.googleContacts.linked = true;
          let response = await this.fetchContactFromApi('/google/contacts');
          this.googleContacts.data = response.data;
          for( let i = 0; i < response.data.length; i++ ) {
            this.showContacts[i] = false;
          }
        } catch(error) {
          console.log(error.response.data);
          this.googleContacts.linked = false;
        }
      }
      else if(type === 'outlook') {
        // console.log('Load danh ba Outlook');

        try {
          await axios.post(this.$backendHost + '/outlook/load-contacts', {
            accessToken: localStorage.getItem('accessToken')
          });
          this.outlookContacts.linked = true;
          let response = await this.fetchContactFromApi('/outlook/contacts');
          this.outlookContacts.data = response.data;
          for( let i = 0; i < response.data.length; i++ ) {
            this.showContacts[i] = false;
          }
        } catch(error) {
          console.log(error.response.data);
          this.outlookContacts.linked = false;
        }
      }
      else if( type === 'YSC' ) {
        // console.log('Load danh ba YSC');
        
        try {
          let response = await this.fetchContactFromApi('/contacts');
          if (response.data.syncAt === null) {
            this.syncContacts.data.syncAt = null;
          } 
          else {
            this.syncContacts.data.syncAt = new Date(response.data.syncAt);
          }          
          this.syncContacts.data.contacts = response.data.contacts;
          for( let i = 0; i < response.data.contacts.length; i++ ) {
            this.showContacts[i] = false;
          }
        } catch(e) {
          // statements
          console.log(e);
        }
      }
      else {
        console.warn('Khong co loai nay');
      }
    },

    fetchContactFromApi(path) {
      let url = this.$backendHost + path;
      return axios.get(url,{
        params: {
            accessToken: localStorage.getItem('accessToken')
          }
      });
    },

    async refreshYSCContacts() {
      this.checkedContacts = [];
      this.syncContacts.loading = true;
      await this.loadContacts('YSC');
      this.syncContacts.loading = false;
    },

    async refreshGoogleContacts() {
      this.googleContacts.loading = true;
      await this.loadContacts('google');
      this.googleContacts.loading = false;
    },

    async refreshOutlookContacts() {
      this.outlookContacts.loading = true;
      await this.loadContacts('outlook');
      this.outlookContacts.loading = false;
    },

    //tao 1 lien he moi
    handleModalCreate(){
      this.showModalCreate = true;
      this.newContact = {
        phoneName: '',
        phoneNumbers: []
      };
      this.addPhoneNumber = 0;
    },
    async createContact(event) {
      event.preventDefault();
      // console.log(this.newContact);
      try {
        let response =  await axios.post(this.$backendHost + '/contact', {
          accessToken: localStorage.getItem('accessToken'),
          phoneName: this.newContact.phoneName,
          phoneNumbers: this.newContact.phoneNumbers
        });

        // console.log(response.data);
        if( response.data.success ) {
          this.showModalCreate = false;
          this.refreshYSCContacts();
        }
        else {
          console.log(response.data);
        }
      } catch(e) {
        // statements
        console.log(e);
      }
      this.newContact = {
        phoneName: '',
        phoneNumbers: []
      }
    },

    //show modal update va update contact
    handleModalEdit(contact) {
      this.showModalEdit = true;
      this.oldContact.oldPhoneName = contact.phoneName;
      this.oldContact.newPhoneName = contact.phoneName;
      this.oldContact.phoneNumbers = contact.phoneNumbers.slice();
      this.addPhoneNumberEdit = contact.phoneNumbers.length;
    },
    async updateContact(event) {
      event.preventDefault();
      // console.log(this.oldContact);
      try {
        let response = await axios.put(this.$backendHost + '/contact', {
          accessToken: localStorage.getItem('accessToken'),
          oldPhoneName: this.oldContact.oldPhoneName,
          newPhoneName: this.oldContact.newPhoneName,
          phoneNumbers: this.oldContact.phoneNumbers
        });

        // console.log(response.data);
        if( response.data.success ) {
          this.showModalEdit = false;
          this.refreshYSCContacts();
        }
        else {
          console.log(response.data);
        }
      } catch(e) {
        // statements
        console.log(e);
      }
    },

    //xoa 1 lien he
    deleteContact(phoneName){
      var message = `Xóa '${phoneName}' khỏi danh bạ?`;
      var deleteCallback = async () => {
        try {
          let response = await axios.delete(this.$backendHost + '/contact',{
            params: {
              accessToken: localStorage.getItem('accessToken'),
              phoneName: phoneName
            }
          });

          if( response.data.success ) {
            this.refreshYSCContacts();
          }
        } catch(e) {
          // statements
          console.log(e);
        }
      };
      this.customConfirm(message, deleteCallback);
    },

    // xoa nhieu lien he
    async deleteMultipleContacts() {
      var message = `Xóa ${this.checkedContacts.length} liên hệ khỏi danh bạ?`;
      var deleteCallback = async () => {
        try {
          let response = await axios.post(this.$backendHost + '/contact/delete-multiple',{
            accessToken: localStorage.getItem('accessToken'),
            listPhoneNames: this.checkedContacts
          });

          if( response.data.success ) {
            this.refreshYSCContacts();
          }
        } catch(e) {
          // statements
          console.log(e);
        }
        this.checkedContacts = [];
      };
      this.customConfirm(message, deleteCallback);
    },

    // đồng bộ ngược Google
    async syncReverseGoogle() {
      this.googleContacts.loading = true;
      try {
        let response = await axios.get(this.$backendHost + '/google/sync-reverse',{
          params: {
            accessToken: localStorage.getItem('accessToken')
          }
        });

        if( response.data.success ) {
          this.refreshGoogleContacts();
        }
      } catch(e) {
        // statements
        console.log(e);
      }
    },

    // đồng bộ ngược Outlook
    async syncReverseOutlook() {
      this.outlookContacts.loading = true;
      try {
        let response = await axios.get(this.$backendHost + '/outlook/sync-reverse',{
          params: {
            accessToken: localStorage.getItem('accessToken')
          }
        });

        if( response.data.success ) {
          this.refreshOutlookContacts();
        }
      } catch(e) {
        // statements
        console.log(e);
      }
    },

    // xử lý chọn tất cả liên hệ
    selectAll(){
      if(!this.allSelected){
        this.checkedContacts = [];
        for(let contact in this.syncContacts.data.contacts) {
            this.checkedContacts.push(this.syncContacts.data.contacts[contact].phoneName);
        }
      }
      else{
        this.checkedContacts=[];
      }
    },// tick de chon tat ca cac lien he

    customConfirm(message, callback){
      this.confirmMessage = message;
      this.showConfirmPopup = true;
      document.querySelector('.confirm').onclick = () => {
        this.showConfirmPopup = false;
      };
      document.querySelector('.confirm-popup').onclick = (event) => {
        event.stopPropagation();
      }
      document.querySelector('.confirm-btns .cancel-btn').onclick = () => {
        this.showConfirmPopup = false;
      };
      document.querySelector('.confirm-btns .agree-btn').onclick = () => {
        this.showConfirmPopup = false;
        callback();
      };
    },

  },

  created() {
    if( localStorage.getItem("accessToken") === null ) return;
    this.syncContacts.loading = true;
    setTimeout( async () => {
      await this.loadContacts('YSC');
      this.syncContacts.loading = false;
    }, 1000);
  },

  watch: {
    typeContacts(type) {
      this.showContacts = [];

      if( type === 'YSC') {
        console.log('YSC');
        this.refreshYSCContacts();
      }
      else if( type === 'google' ) {
        console.log('Google');
        this.refreshGoogleContacts();
      }
      else if( type === 'outlook' ) {
        console.log("Outlook");
        this.refreshOutlookContacts();
      }
    },

    checkedContacts(arrayChecked) {
      if( arrayChecked.length !== 0 && arrayChecked.length === this.syncContacts.data.contacts.length ) {
        this.allSelected = true;
      }
      else {
        this.allSelected = false;
      }
    }
  }
}
</script>
<style src="../assets/css/bootstrap_homtest.css" scoped></style>
<style src="../assets/css/Hometest.css" scoped></style>