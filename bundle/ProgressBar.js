const { bgMagentaBright } = require("chalk");

module.exports = class ProgressBar {
	constructor() {
		this.total;
		this.current;
        this.bar_length=30;
	}

	init(total,length) {
		this.total = total;
        this.current = 0;
        length && (this.bar_length=length)
	}

	update(current) {
		this.current = current;
		const current_progress = this.current / this.total;
		this.draw(current_progress);
	}

	draw(current_progress) {
		const filled_bar_length = (current_progress * this.bar_length).toFixed(
			0
		);
		const empty_bar_length = this.bar_length - filled_bar_length;

		const filled_bar = this.get_bar(filled_bar_length);
		const empty_bar = this.get_bar(empty_bar_length, bgMagentaBright);
		const percentage_progress = (current_progress * 100).toFixed(2);

        process.stdout.clearLine();
		process.stdout.cursorTo(0);
		process.stdout.write(
			`${filled_bar}${empty_bar}  ${30-this.current}s`
		);
	}

	get_bar(length, color = a => a) {
		let str = "";
		for (let i = 0; i < length; i++) {
			str += " ";
		}
		return color(str);
	}
};