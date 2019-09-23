import { AlertModule } from 'vux'

const commom = {
  alert: function(content,status){
    AlertModule.show({
      title: '提示',
      content: content,
      onShow () {
        if(!status){
          setTimeout(() => {
            AlertModule.hide()
          }, 3000);
        }
      }
    })
  },
}

export { commom };