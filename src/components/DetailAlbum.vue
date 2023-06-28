<template>
    <template v-if="!isLoading">
        <div class="photos">
            <div v-for="photo in photos" :key="photo.id" class="photo">
                <img :src="photo.thumbnailUrl" :alt="photo.title">
                <p @click="() => VisiblitiChange(photo.id)" style="cursor: pointer;">{{ photo.title }}</p>
            </div>
        </div>
    </template>
    <template v-else>
        <Loader />
    </template>
    <div class="modal-f" @click="unShowModal" v-if="isTrue">
        <div class="modal-v-container">
            <div class="modal-header d-flex justify-content-between">
                <h5 class="modal-title">{{ modal.title }}</h5>
                <div>
                    <button @click="isTrue = false" class="btn">
                        <i class="fa-solid fa-x"></i>
                    </button>
                </div>
            </div>
            <div class="modal-body-v">
                <img :src="modal.src">
            </div>
        </div>
    </div>
</template>
<script>
import Album from "@/services/album"
export default {
    mounted() {
        this.isLoading = true
        Album.getPhoto()
            .then((res) => {
                let data = []
                for (let i = 0; i < res.data.length; i++) {
                    const element = res.data[i];
                    if (element.albumId === parseInt(this.$route.params.id)) {
                        data.push(element)
                    }
                }
                this.photos = data
                this.isLoading = false
            })
            .catch(err => console.log(err))
    },
    data() {
        return {
            photos: null,
            isLoading: false,
            modal: {
                title: '',
                src: ''
            },
            isTrue: false
        }
    },
    methods: {
        VisiblitiChange(id) {
            const found = this.photos.find(c => c.id === parseInt(id))
            this.modal.title = found.title
            this.modal.src = found.url
            this.isTrue = true
        },
        unShowModal(e) {
            if (e.target.getAttribute('class') === 'modal-f') {
                this.isTrue = false
            }
        }
    }
}
</script>
<style scoped>
.photos {
    display: grid;
    grid-template-columns: repeat(3, auto);
    align-items: center;
    row-gap: 30px;

}

.modal-v-container {
    width: 640px;
    padding: 20px;
    border-radius: 10px;
    height: 680px;
    background-color: rgba(255, 255, 255, 0.523);
}

.modal-f {
    width: 100%;
    height: 100%;
    display: flex !important;
    justify-content: center;
    align-items: center;
    position: fixed;
    z-index: 999;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: rgba(0, 0, 0, 0.5);
}

.photos .photo {
    border: 1px solid var(--bs-gray-400);
    width: 300px;
    padding: 10px;
}

.photos .photo img {
    width: 280px;
    object-fit: cover;
}

@media only screen and (max-width:1145px) {
    .photos {
        grid-template-columns: repeat(2, auto);
        justify-content: center;
        column-gap: 50px;
    }
}

@media only screen and (max-width:701px) {
    .photos{
        grid-template-columns: auto;
    }

    .modal-v-container{
        width: 400px;
        height: 500px;
    }
    .modal-body-v img{
        width: 100%;
        height: 100%;
    }
}

@media only screen and (max-width:421px) {
    .modal-v-container{
        width: 300px;
    }
}
</style>