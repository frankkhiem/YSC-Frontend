<template>
<div>
<!-- tml khanh -->
	<div class="contacts container-fluid">
    <div class="row">
      <div class="col-3">
        <div class="nav flex-column nav-pills menu p-4" id="v-pills-tab" role="tablist" aria-orientation="vertical">
          <a @click="handleShowContacts('showSyncContacts')" :class="syncActive" id="v-pills-ysc-contact-tab btn" data-toggle="pill"  role="tab" aria-controls="v-pills-ysc-contact" aria-selected="true"><i class="fas fa-address-book"></i>&nbsp;&nbsp;&nbsp;YSC CONTACT</a>
          <a @click="handleShowContacts('showGoogleContacts')" :class="ggActive" id="v-pills-gg-contact-tab btn" data-toggle="pill" role="tab" aria-controls="v-pills-gg-contact" aria-selected="false"><i class="fab fa-google"></i>&nbsp;&nbsp;GOOGLE CONTACT</a>
          <a @click="handleShowContacts('showOutlookContacts')" :class="outlookActive" id="v-pills-outlook-contact-tab btn" data-toggle="pill" role="tab" aria-controls="v-pills-outlook-contact" aria-selected="false"><i class="fab fa-microsoft"></i>&nbsp;&nbsp;OUTLOOK CONTACT</a>
        </div>
      </div>
      <div class="col-5">
        <div class="tab-content" id="v-pills-tabContent">
          <!-- ysc-contact -->
          <div class="tab-pane fade show active" id="v-pills-ysc-contact" role="tabpanel" aria-labelledby="v-pills-ysc-contact-tab">
            <!-- paste cái bảng ysc-contact vào đây.chỉnh sửa tý cho giốngcái bảng mẫu ysc-contact. paste xong nhớ bảng ví dụ xóa đi -->

	<div class="container-xl" style="padding-top: 25px;">
		<div class="table-responsive" style="margin: auto;">
			<div class="table-wrapper">
				<div class="table-title">
					<div class="row">
						<div class="col-sm-7">
							<b style="font-size:24px; float:left;">YSC Contacts</b>
              <a v-show="showSyncContacts" @click="handleModalCreate()" class="btn btn-success" data-toggle="modal" style="float: left;"><i class="material-icons">&#xE147;</i> <span>Thêm liên lạc</span></a>
              <a v-show="showSyncContacts && checkedContacts.length != 0" class="btn btn-danger" data-toggle="modal" style="float: left;"><i class="material-icons">&#xE15C;</i> <span>Xóa liên lạc</span></a>						             							
						</div>
						<div class="col-sm-5">						
							<a v-if="showSyncContacts" @click="sync" class="btn btn-info" data-toggle="modal"><i class="fas fa-sync"></i> <span>Đồng bộ</span></a>
              <a v-if="!showSyncContacts" @click="sync" class="btn btn-info" data-toggle="modal"><i class="fas fa-sync"></i> <span>Đồng bộ ngược</span></a>
							<a @click="reloadContacts()" class="btn btn-primary" data-toggle="modal"><i class="fas fa-redo-alt"></i> <span>Làm mới</span></a>																		
						</div>
					</div>
				</div>
        <div class="table-scroll"> 
          <!-- syncontact-->
          <table class="table table-striped table-hover" v-if="showSyncContacts">
            <thead class="listcontact">
              <tr>
                <th>
                  <span class="custom-checkbox">
                    <input type="checkbox" id="selectAll" @click="selectAll()" v-model="allSelected">
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
                <td class="dropdown-toggle" @mouseover="showPhonesNumber(index)" @mouseleave="Phones = false">
                  {{ contact.phoneName }}
                  <span class="caret"></span>
                  <ul class="dropdown-menu" v-if="Phones && index==idPerson">
                    <li v-for="(phoneNumber, index) in syncContacts.data.contacts[index].phoneNumbers" :key="index"><a>{{phoneNumber}}</a></li>
                  </ul>
                </td>
                <td>
                  <a class="edit"  data-toggle="modal"><i @click="handleModalEdit(index)" class="material-icons" data-toggle="tooltip" title="Edit">&#xE254;</i></a>
                  <a class="delete" data-toggle="modal"><i @click="handleModalDelete(index)" class="material-icons" data-toggle="tooltip" title="Delete">&#xE872;</i></a>
                </td>
              </tr>
            </tbody>
          </table>
          <!-- google ontact-->
          <table class="table table-striped table-hover" v-if="showGoogleContacts">
            <thead class="listcontact">
              <tr>
                <th>
                  <span class="custom-checkbox">
                    <input type="checkbox" id="selectAll">
                    <label for="selectAll"></label>
                  </span>
                </th>
                <th>Tên liên lạc</th>
              </tr>
            </thead>
            <tbody v-if="!googleContacts.loading">
              <tr  v-for="(contact, index) in googleContacts.data" :key="index" class="dropdown" >
                <td>
                  <span class="custom-checkbox">
                    <input type="checkbox" id="checkbox1" @change="isDelete++" value="1">
                    <label for="checkbox1"></label>
                  </span>
                </td>
                <td class="dropdown-toggle" @mouseover="showPhonesNumber(index)" @mouseleave="Phones = false">
                  {{ contact.phoneName }}
                  <span class="caret"></span>
                  <ul class="dropdown-menu" v-if="Phones && index==idPerson">
                    <li v-for="(phoneNumber, index) in googleContacts.data[index].phoneNumbers" :key="index"><a>{{phoneNumber}}</a></li>
                  </ul>
                </td>
              </tr>
            </tbody>
          </table>
          <!-- outlookcontact-->
          <table class="table table-striped table-hover" v-if="showOutlookContacts">
            <thead class="listcontact">
              <tr>
                <th>
                  <span class="custom-checkbox">
                    <input type="checkbox" id="selectAll">
                    <label for="selectAll"></label>
                  </span>
                </th>
                <th>Tên liên lạc</th>
              </tr>
            </thead>
            <tbody v-if="!outlookContacts.loading">
              <tr  v-for="(contact, index) in outlookContacts.data" :key="index" class="dropdown" >
                <td>
                  <span class="custom-checkbox">
                    <input type="checkbox" id="checkbox1" @change="isDelete++" value="1">
                    <label for="checkbox1"></label>
                  </span>
                </td>
                <td class="dropdown-toggle" @mouseover="showPhonesNumber(index)" @mouseleave="Phones = false">
                  {{ contact.phoneName }}
                  <span class="caret"></span>
                  <ul class="dropdown-menu" v-if="Phones && index==idPerson">
                    <li v-for="(phoneNumber, index) in outlookContacts.data[index].phoneNumbers" :key="index"><a>{{phoneNumber}}</a></li>
                  </ul>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
			</div>
		</div>
		<div id="addEmployeeModal" v-if="showModalCreate">
		<div class="modal-dialog">
			<div class="modal-content">
				<form>
					<div class="modal-header">						
						<h4 class="modal-title">Tạo liên hệ</h4>
						<button type="button" @click="showModalCreate = false" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
					</div>
					<div class="modal-body">					
						<div class="form-group">
							<label>Tên</label>
							<input type="text" class="form-control" required >
						</div>
						<div class="form-group">
							<label style="padding-right: 7px;">Số điện thoại</label> <i @click="addPhoneNumber++" class="fas fa-plus-circle btn"></i>
							<input type="text" class="form-control" required>
						</div>
						<div v-for="index in addPhoneNumber" :key="index" class="form-group">
							<i @click="addPhoneNumber--" class="fas fa-minus-circle"></i>
              <input type="text" class="form-control" required>
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
				<form>
					<div class="modal-header">						
						<h4 class="modal-title">Chỉnh sửa liên hệ</h4>
						<button type="button" @click="showModalEdit=false" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
					</div>
					<div class="modal-body">					
						<div class="form-group">
							<label>Tên</label>
							<input type="text" class="form-control" required v-model="syncContacts.data.contacts[tempIndex].phoneName">
						</div>
						<div class="form-group">
							<label style="padding-right: 7px;">Số điện thoại</label> <i @click="addPhoneNumber++" class="fas fa-plus-circle"></i>
							<input type="text" class="form-control" v-model="syncContacts.data.contacts[tempIndex].phoneNumbers" required>
						</div>
						<div v-for="index in addPhoneNumber" :key="index" class="form-group">
							<label style="padding-right: 7px;">Số điện thoại</label> <i @click="addPhoneNumber--" class="fas fa-minus-circle"></i>
							<input type="text" class="form-control" required>
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
	<!--tml manh-->         
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
  Phones: false ,
	addPhoneNumber: 0, 
	showModalEdit: false,
	showModalCreate: false,
  showSyncContacts: true, 
  showGoogleContacts: false,
  showOutlookContacts: false,
	tempIndex: 0,
  checkedContacts: [],
  allSelected: false,
  syncActive: "nav-link active py-3",
  ggActive: "nav-link py-3",
  outlookActive: "nav-link py-3",   
      syncContacts: {
        loading: true,
        data: {}
      },
      googleContacts: {
        loading: true,
        data: []
      },
      outlookContacts: {
        loading: true,
        data: []
      },   
    }
  }, 
  
  computed: {
    ...mapGetters({
      user: 'profile',
      auth: 'userAuthenticated'
    }),
  },

  methods: {
    async sync() {
      console.log('Dong bo danh ba nguoi dung');
      this.syncContacts.loading = true;

      try {
        let response = await axios.get(this.$backendHost + '/sync-contacts', {
          params: {
            accessToken: localStorage.getItem('accessToken')
          }
        });

        this.syncContacts.data.syncAt = new Date(response.data.syncAt);
        this.syncContacts.data.contacts = response.data.contacts;
      } catch(error) {
        console.log(error.response.data);
      }

      this.syncContacts.loading = false;
    },

    async loadContacts(type) {
      if( type === 'google' ) {
        console.log('Load danh ba Google');
        this.googleContacts.loading = true;

        try {
          await axios.post(this.$backendHost + '/google/load-contacts', {
            accessToken: localStorage.getItem('accessToken')
          });
          let response = await this.fetchContactFromApi('/google/contacts');
          this.googleContacts.data = response.data;
        } catch(error) {
          console.log(error.response.data);
        }

        this.googleContacts.loading = false;
      }
      else if(type === 'outlook') {
        console.log('Load danh ba Outlook');
        this.outlookContacts.loading = true;

        try {
          await axios.post(this.$backendHost + '/outlook/load-contacts', {
            accessToken: localStorage.getItem('accessToken')
          });
          let response = await this.fetchContactFromApi('/outlook/contacts');
          this.outlookContacts.data = response.data;
        } catch(error) {
          console.log(error.response.data);
        }

        this.outlookContacts.loading = false;
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
	//tao 1 lien he moi
	handleModalCreate(){
		this.showModalCreate = true;
		this.addPhoneNumber = 0;
	},

	//show modal va lay ra index trong array contact
	handleModalEdit($index){
		this.showModalEdit = true;
		this.tempIndex = $index;
		this.addPhoneNumber = 0;
	},
	//xoa lien lac
	handleModalDelete(){
		alert('Bạn có chắc chắn xóa liên hệ này ?');
	},
  //xu ly viec show cac contact
  handleShowContacts($showContacts)
  {
    if($showContacts=="showSyncContacts")
    {
      this.showSyncContacts = true;
      this.showGoogleContacts = false;
      this.showOutlookContacts = false;
      this.syncActive = "nav-link active py-3"
      this.ggActive = "nav-link py-3"
      this.outlookActive = "nav-link py-3"
    }
    if($showContacts=="showGoogleContacts")
    {
      this.showSyncContacts = false;
      this.showGoogleContacts = true;
      this.showOutlookContacts = false;
      this.ggActive = "nav-link active py-3"
      this.syncActive = "nav-link py-3"
      this.outlookActive = "nav-link py-3"
    }
    if($showContacts=="showOutlookContacts")
    {
      this.showSyncContacts = false;
      this.showGoogleContacts = false;
      this.showOutlookContacts = true;
      this.ggActive = "nav-link py-3"
      this.syncActive = "nav-link py-3"
      this.outlookActive = "nav-link active py-3"
    }
  },
  //reload contact theo trang thai contact dang active
  reloadContacts(){
      if(this.showGoogleContacts) this.loadContacts('google')
      if(this.showOutlookContacts) this. loadContacts('outlook')
  },

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

  showPhonesNumber($index){
    this.Phones = true;
    this.idPerson = $index;
  }//chi hien so dien thoai cua duy nhat lien he do khi tro vao lien he
  },

  created() {
    if( localStorage.getItem("accessToken") === null ) return;
    setTimeout( () => {
      this.fetchContactFromApi('/contacts')
        .then( response => {          
          if (response.data.syncAt === null) {
            this.syncContacts.data.syncAt = null;
          } else {
            this.syncContacts.data.syncAt = new Date(response.data.syncAt);
          }          
          this.syncContacts.data.contacts = response.data.contacts;
          this.syncContacts.loading = false;
        } )
        .catch( () => {
          return;
        });

      this.fetchContactFromApi('/google/contacts')
        .then( response => {
          this.googleContacts.loading = false;
          this.googleContacts.data = response.data;
        } )
        .catch( () => {
          return;
        });

      this.fetchContactFromApi('/outlook/contacts')
        .then( response => {
          this.outlookContacts.loading = false;
          this.outlookContacts.data = response.data
        } )
        .catch( () => {
          return;
        });
    }, 1000);
  },
  
}
</script>
<style src="../assets/css/bootstrap_homtest.css" scoped></style>
<style src="../assets/css/Hometest.css" scoped></style>