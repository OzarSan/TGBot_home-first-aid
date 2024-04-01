export class Loader {
  icons = [
    " 🕛 ",
    " 🕐 ",
    " 🕑 ",
    " 🕒 ",
    " 🕓 ",
    " 🕔 ",
    " 🕕 ",
    " 🕖 ",
    " 🕗 ",
    " 🕘 ",
    " 🕙 ",
  ];

  message = null;
  interval = null;

  constructor(ctx) {
    this.ctx = ctx;
  }
  async show() {
    try {
      let index = 0;
      this.message = await this.ctx.reply(this.icons[index]);
      this.interval = setInterval(async () => {
        index = index < this.icons.length - 1 ? index + 1 : 0;
        await this.ctx.telegram.editMessageText(
          this.ctx.chat.id,
          this.message.message_id,
          null,
          this.icons[index]
        );
      }, 500);
    } catch (err) {
      console.log("loader error");
    }
  }
  hide() {
    clearInterval(this.interval);
    this.ctx.telegram.deleteMessage(this.ctx.chat.id, this.message.message_id);
  }
}
