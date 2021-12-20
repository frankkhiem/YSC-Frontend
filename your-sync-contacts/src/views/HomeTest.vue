<template>
<div>
<!-- tml khanh -->
  <div class="contacts container-fluid">
    <div class="row">
      <div class="col-3">
        <div class="nav flex-column nav-pills menu p-4" id="v-pills-tab" role="tablist" aria-orientation="vertical">
          <a @click="typeContacts = 'YSC'" class="nav-link py-3" :class="[typeContacts === 'YSC' ? 'active' : '']" id="v-pills-ysc-contact-tab btn" data-toggle="pill"  role="tab" aria-controls="v-pills-ysc-contact" aria-selected="true"><i class="fas fa-address-book"></i>&nbsp;&nbsp;&nbsp;YSC CONTACT</a>
          <a @click="typeContacts = 'google'" class="nav-link py-3" :class="[typeContacts === 'google' ? 'active' : '']" id="v-pills-gg-contact-tab btn" data-toggle="pill" role="tab" aria-controls="v-pills-gg-contact" aria-selected="false"><i class="fab fa-google"></i>&nbsp;&nbsp;GOOGLE CONTACT</a>
          <a @click="typeContacts = 'outlook'" class="nav-link py-3" :class="[typeContacts === 'outlook' ? 'active' : '']" id="v-pills-outlook-contact-tab btn" data-toggle="pill" role="tab" aria-controls="v-pills-outlook-contact" aria-selected="false"><i class="fab fa-microsoft"></i>&nbsp;&nbsp;OUTLOOK CONTACT</a>
        </div>
      </div>
      <div class="col-5">
        <div class="tab-content" id="v-pills-tabContent">
          <!-- ysc-contact -->
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
              <a v-show="checkedContacts.length != 0" @click="deleteMultipleContacts" class="btn btn-danger" data-toggle="modal" style="float: left;"><i class="material-icons">&#xE15C;</i> <span>Xóa liên lạc</span></a>                                      
            </div>
            <div class="col-sm-5">            
              <a v-if="showSyncContacts" @click="sync" class="btn btn-info" data-toggle="modal"><i class="fas fa-sync"></i> <span>Đồng bộ</span></a>
              <a @click="refreshYSCContacts()" class="btn btn-primary" data-toggle="modal"><i class="fas fa-redo-alt"></i> <span>Làm mới</span></a>                                 
            </div>
          </div>
        </div>
        <div style="text-align: left; padding-bottom: 4px; padding-left:14px">
            <span v-if="syncContacts.data.syncAt">
              <b>Đồng bộ lần cuối vào: {{ syncContacts.data.syncAt.toLocaleString() }}</b>
            </span>
            <span v-else>
              <b>Chưa từng được đồng bộ!</b>
            </span>
          </div>
        <div class="table-scroll"> 
          <table class="table table-striped table-hover" v-if="showSyncContacts">
            <thead class="listcontact">
              <tr>
                <th>
                  <span class="custom-checkbox">
                    <input type="checkbox" id="selectAll" ref="selectAll" @click="selectAll()" v-model="allSelected">
                    <label for="selectAll"></label>
                  </span>
                </th>
                <th>Tên liên lạc</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody v-if="!syncContacts.loading">
              <tr  v-for="(contact, index) in syncContacts.data.contacts" :key="index" class="dropdown" >
                <td>
                  <span class="custom-checkbox">
                    <input type="checkbox" id="checkbox1" @change="isDelete++" :value="contact.phoneName" v-model="checkedContacts" checked>
                    <label for="checkbox1"></label>
                  </span>
                </td>
                <td @click="showContact(index)">
                  <div 
                    class="dropdown-toggle" 
                    :class="[showYSCContact[index] ? 'reverse' : '' ]"
                  >
                    {{ contact.phoneName }}
                  </div>

                  <div v-show="showYSCContact[index]" class="phone-numbers"> 
                    <div>Thông tin liên hệ</div>
                    <ul>
                      <li 
                        v-for="(phoneNumber, index) in syncContacts.data.contacts[index].phoneNumbers"
                        :key="index"
                      >
                        {{ phoneNumber }}
                      </li>
                    </ul>
                  </div>
                </td>
                <td>
                  <a class="edit"  data-toggle="modal"><i @click="handleModalEdit(contact)" class="material-icons" data-toggle="tooltip" title="Edit">&#xE254;</i></a>
                  <a class="delete" data-toggle="modal"><i @click="deleteContact(syncContacts.data.contacts[index].phoneName)" class="material-icons" data-toggle="tooltip" title="Delete">&#xE872;</i></a>
                </td>
              </tr>
            </tbody>
            <img v-else class="loading-contacts" src="@/assets/img/Spin-2s-204px.gif">
          </table>
          <!-- google ontact-->
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
                <label style="padding-right: 7px;">Số điện thoại</label> <i @click="addPhoneNumber++" class="fas fa-plus-circle"></i>
                <input type="text" name="phoneName" class="form-control" v-model="newContact.phoneNumbers[0]" required>
              </div>
              <div v-for="index in addPhoneNumber" :key="index" class="form-group">
                <i @click="addPhoneNumber--; newContact.phoneNumbers.splice(index, 1);" class="fas fa-minus-circle" style="float: right; margin-top: 9px;"></i>
                <input type="text" class="form-control" v-model="newContact.phoneNumbers[index]" required>
              </div>            
            </div>
            <div class="modal-footer">
              <input @click="showModalCreate = false" type="button" class="btn btn-default" data-dismiss="modal" value="Cancel">
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
              <div class="form-group">
                <label style="padding-right: 7px;">Số điện thoại</label> <i @click="addPhoneNumberEdit++" class="fas fa-plus-circle"></i>
              </div>
              <div v-for="index in addPhoneNumberEdit" :key="index" class="form-group">
                <i v-if="index != 1" @click="addPhoneNumberEdit--; oldContact.phoneNumbers.splice(index-1, 1);" class="fas fa-minus-circle" style="float: right; margin-top: 9px;"></i>
                <input type="text" class="form-control" v-model="oldContact.phoneNumbers[index-1]" required>
              </div>            
            </div>
            <div class="modal-footer">
              <input @click="showModalEdit=false" type="button" class="btn btn-default" data-dismiss="modal" value="Cancel">
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
        <div class="table-title" style="background-color: rgb(255 112 80 / 92%);">
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
          <table class="table table-striped table-hover" style="margin-left:30px">
            <thead class="listcontact">
              <tr>
                <th>Tên liên lạc</th>
              </tr>
            </thead>
            <tbody v-if="!googleContacts.loading">
              <tr  v-for="(contact, index) in googleContacts.data" :key="index" class="dropdown" >
                <td @click="showContact(index)">
                  <div 
                    class="dropdown-toggle" 
                    :class="[showYSCContact[index] ? 'reverse' : '' ]"
                  >
                    {{ contact.phoneName }}
                  </div>
                  <span class="caret"></span>
                  <ul v-if="Phones[index]">
                    <li v-for="(phoneNumber, index) in googleContacts.data[index].phoneNumbers" :key="index"><a>{{phoneNumber}}</a></li>
                  </ul>

                  <div v-show="showYSCContact[index]" class="phone-numbers"> 
                    <div>Thông tin liên hệ</div>
                    <ul>
                      <li 
                        v-for="(phoneNumber, index) in syncContacts.data[index].phoneNumbers"
                        :key="index"
                      >
                        {{ phoneNumber }}
                      </li>
                    </ul>
                  </div>
                </td>
              </tr>
            </tbody>
            <img v-else class="loading-contacts" src="@/assets/img/Spin-2s-204px.gif">
          </table>
        </div>
      </div>
    </div>      
  </div>

  <!-- Outlook Contacts -->
  <div v-if="typeContacts === 'outlook'" class="container-xl" style="padding-top: 25px;">
    <div class="table-responsive" style="margin: auto;">
      <div class="table-wrapper">
        <div class="table-title" style="background-color: #4285f4">
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
          <table class="table table-striped table-hover" style="margin-left:20px">
            <thead class="listcontact">
              <tr>
                <th>Tên liên lạc</th>
              </tr>
            </thead>
            <tbody v-if="!outlookContacts.loading">
              <tr  v-for="(contact, index) in outlookContacts.data" :key="index" class="dropdown" >
                <td @click="showContact(index)">
                  <div 
                    class="dropdown-toggle" 
                    :class="[showYSCContact[index] ? 'reverse' : '' ]"
                  >
                    {{ contact.phoneName }}
                  </div>
                  <span class="caret"></span>
                  <ul v-if="Phones[index]">
                    <li v-for="(phoneNumber, index) in syncContacts.data.contacts[index].phoneNumbers" :key="index"><a>{{phoneNumber}}</a></li>
                  </ul>

                  <div v-show="showYSCContact[index]" class="phone-numbers"> 
                    <div>Thông tin liên hệ</div>
                    <ul>
                      <li 
                        v-for="(phoneNumber, index) in syncContacts.data.contacts[index].phoneNumbers"
                        :key="index"
                      >
                        {{ phoneNumber }}
                      </li>
                    </ul>
                  </div>
                </td>
              </tr>
            </tbody>
            <img v-else class="loading-contacts" src="@/assets/img/Spin-2s-204px.gif">
          </table>
        </div>
      </div>
    </div>      
  </div>

    <div class="ysc-contact">
      </div>
          </div>
          <!-- gg-contact -->
          <div class="tab-pane fade" id="v-pills-gg-contact" role="tabpanel" aria-labelledby="v-pills-gg-contact-tab">paste cái bảng gg-contact vào đây</div>
          <!-- outlook-contact -->
          <div class="tab-pane fade" id="v-pills-outlook-contact" role="tabpanel" aria-labelledby="v-pills-outlook-contact-tab">paste cái bảng ysc-contact vào đây</div>
        </div>
      </div>
    </div>
  </div>
  <!-- tml khanh -->
</div>  
</template>
<script>
import { mapGetters } from 'vuex';
import axios from 'axios';

export default {
  data() {
    return {
      idPerson: null, // id cua nguoi muon xem so dien thoai khi click
      isDelete: 0,
      Phones: [] ,
      addPhoneNumber: 0, 
      addPhoneNumberEdit: 0,
      showModalEdit: false,
      showModalCreate: false,
      showSyncContacts: true, 
      showGoogleContacts: false,
      showOutlookContacts: false,
      checkedContacts: [],
      allSelected: false,
      showYSCContact: [],

      typeContacts: 'YSC',  
      syncContacts: {
        loading: false,
        data: {}
      },
      googleContacts: {
        loading: false,
        data: []
      },
      outlookContacts: {
        loading: false,
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
      }
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
      this.$set(this.showYSCContact, index, !this.showYSCContact[index]);
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
        console.log('Load danh ba Google');

        try {
          await axios.post(this.$backendHost + '/google/load-contacts', {
            accessToken: localStorage.getItem('accessToken')
          });
          let response = await this.fetchContactFromApi('/google/contacts');
          this.googleContacts.data = response.data;
        } catch(error) {
          console.log(error.response.data);
        }
      }
      else if(type === 'outlook') {
        console.log('Load danh ba Outlook');

        try {
          await axios.post(this.$backendHost + '/outlook/load-contacts', {
            accessToken: localStorage.getItem('accessToken')
          });
          let response = await this.fetchContactFromApi('/outlook/contacts');
          this.outlookContacts.data = response.data;
        } catch(error) {
          console.log(error.response.data);
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
          for( var i = 0; i < response.data.contacts.length; i++ ) {
            this.showYSCContact[i] = false;
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
    handleModalEdit(contact){
      this.showModalEdit = true;
      this.oldContact.oldPhoneName = contact.phoneName;
      this.oldContact.newPhoneName = contact.phoneName;
      this.oldContact.phoneNumbers = contact.phoneNumbers;
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
      } catch(e) {
        // statements
        console.log(e);
      }
    },

    //xoa 1 lien he
    async deleteContact(phoneName){
      // console.log(phoneName);
      let accept = confirm(`Bạn có chắc muốn xóa '${phoneName}' khỏi danh bạ không?`);
      if( accept ) {
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
      }
    },

    // xoa nhieu lien he
    async deleteMultipleContacts() {
      // console.log(JSON.stringify(this.checkedContacts));
      let accept = confirm(`Bạn có chắc muốn xóa những liên hệ này khỏi danh bạ không?`);
      if( accept ) {
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
      }
      this.checkedContacts = []
      this.$refs.selectAll.checked = false;
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

    // 
    selectAll(){
      if(!this.allSelected){
        for(let contact in this.syncContacts.data.contacts) {
            this.checkedContacts.push(this.syncContacts.data.contacts[contact].phoneName);
        }
      }
      else{
        this.checkedContacts=[]
      }
    },// tick de chon tat ca cac lien he

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
      if( type === 'YSC') {
        console.log('YSC');
        this.refreshYSCContacts()
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

    // showYSCContact() {
    //   handler: function (val, oldVal) {
    //     console.log(val);
    //   },
    //   deep: true
    // }
  }
}
</script>
<style src="../assets/css/bootstrap_homtest.css" scoped></style>
<style src="../assets/css/Hometest.css" scoped></style>