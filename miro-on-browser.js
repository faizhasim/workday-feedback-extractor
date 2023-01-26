
(async () => {
	const style = {
		review: {
			width: 600,
			margin: 20
		},
		box: {
			margin: 5
		}
	}

	const MAGIC_NUM_review_count = 4;
	const MAGIC_NUM_y_pos_question_text = 50;

	const xDisplacementCoeff = MAGIC_NUM_review_count * style.review.width
		+ 2 * MAGIC_NUM_review_count * style.review.margin
		+ 2 * MAGIC_NUM_review_count * style.box.margin
		+ 50;
	const addFeedback = async (question, feedback, opts) => {
		const feedbackSetIndex = opts?.feedbackSetIndex ?? 0;
		const reviewNum = opts?.reviewNum ?? 0;

		const xDisplacement = feedbackSetIndex * xDisplacementCoeff;

		const textXPos = xDisplacement + (reviewNum*style.review.width) + reviewNum*(style.review.margin) + reviewNum*(style.box.margin);

		const questionText = await miro.board.createText({
			content: `<strong>${question}</strong>`,
			style: {
				color: "#e6167d",
				fillColor: "transparent",
				fillOpacity: 0.1,
				fontFamily: "roboto",
				fontSize: 18,
				textAlign: "left"
			},
			x: textXPos,
			y: MAGIC_NUM_y_pos_question_text,
			width: style.review.width,
		});

		const feedbackText = await miro.board.createText({
			content: feedback,
			style: {
				color: "#253c7c",
				fillColor: "transparent",
				fillOpacity: 1,
				fontFamily: "roboto_condensed",
				fontSize: 24,
				textAlign: "left"
			},
			x: textXPos,
			y: questionText.y + (questionText.height),
			width: style.review.width,
		});

		feedbackText.y = (questionText.height ) + questionText.y;
		feedbackText.sync();

		const boundaryBox = await miro.board.createShape({
			content: '',
			shape: 'rectangle',
			style: {
				borderColor: "transparent",
				borderOpacity: 1,
				borderStyle: "normal",
				borderWidth: 2,
				color: "#e6167d",
				fillColor: "#ffffff",
				fillOpacity: 0.1,
				fontFamily: "roboto",
				fontSize: 18,
				textAlign: "left",
				textAlignVertical: "middle"
			},
			x: questionText.x - style.box.margin,
			y: (2*MAGIC_NUM_y_pos_question_text) + ((questionText.height + feedbackText.height - feedbackText.y) / 2),
			width: questionText.width + (2 * style.box.margin),
			height: (2 * questionText.height) + feedbackText.height + (2 * style.box.margin),
		});
		return [questionText, feedbackText, boundaryBox];
	}

	const renderFeedbackSet = async ([title, feedbacks], feedbackSetIndex = 0) => {
		const reviewsDimension = {
			x: feedbackSetIndex * xDisplacementCoeff,
			y: 0,
			width: 0,
		}

		const itemsToAddIntoFrame = [];

		await Promise.all(
			feedbacks.map(async (feedback, reviewNum) => {
				const [questionText, feedbackText, boundaryBox] = await addFeedback(
					feedback.question,
					feedback.feedback,
					{
						feedbackSetIndex,
						reviewNum
					}
				)

				itemsToAddIntoFrame.push(questionText);
				itemsToAddIntoFrame.push(feedbackText);
				itemsToAddIntoFrame.push(boundaryBox);

				reviewsDimension.width = reviewsDimension.width + boundaryBox.width + style.review.margin;
			})
		)

		const titleText = await miro.board.createText({
			content: title,
			style: {
				color: "#253c7c",
				fillColor: "transparent",
				fillOpacity: 0.5,
				fontFamily: "bangers",
				fontSize: 36,
				textAlign: "center"
			},
			x: reviewsDimension.x + .5*(reviewsDimension.width/feedbacks.length) + .5*(reviewsDimension.width/MAGIC_NUM_review_count),
			y: reviewsDimension.y - 80,
			width: reviewsDimension.width,
		});

		const framePadding = 10;
		const frameWidth = titleText.width + (framePadding*2);
		const frameHeight = frameWidth * 9 / 16;

		const frame = await miro.board.createFrame({
			title,
			style: {
				fillColor: 'transparent',
			},
			x: titleText.x - framePadding,
			y: titleText.y + frameHeight/2 - framePadding - titleText.height,
			width: frameWidth,
			height: frameHeight,
		});


		frame.x = titleText.x - framePadding;
		frame.y = titleText.y + frameHeight/2 - framePadding - titleText.height;
		frame.width = frameWidth;
		frame.height = frameHeight;
		frame.sync();


		frame.add(titleText);
		await Promise.all(
			itemsToAddIntoFrame.map(item => frame.add(item))
		)

	}


	await Promise.all(
		Object.entries(data).map(async (feedbackSet, feedbackSetIndex) => {
			await renderFeedbackSet(feedbackSet, feedbackSetIndex);
		})
	)

})()
