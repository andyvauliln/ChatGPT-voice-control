import * as React from 'react'
import { FC, useEffect, useRef, useState } from 'react'
import { BiMicrophone } from 'react-icons/bi'
import { RxPaperPlane } from 'react-icons/rx'
import { TbVolume, TbVolumeOff } from 'react-icons/tb'
import '../../assets/styles/tailwind.css'
import Client from '../../fakeyou/Client'
import useLocalSync from '../../hooks/use-local-sync'
import MessagesObserver from '../../modules/messages-observer'
import { triggerEvent } from '../../utils'
import { buttonSelector } from '../../utils/voice-control'

export interface VoiceRecognitionResults { value: string, isFinal: boolean }
console.log('init file');

const fy = new Client({
	usernameOrEmail: 'promtwizard@gmail.com',
	password: '7895123avA!'
});

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

const VoiceControl: FC = () => {
	const [language, setLanguage] = useState('en-US')
	const voiceRecognition: any = React.useRef<any>();
	const audioQueue = useRef([]);
	const isPlaying = useRef(false);
	const delayTime = useRef(0);
	const [isReadAloud, setIsReadAloud] = useState(true);
	const [active, setActive] = useState(false)
	console.log('Init Component');



	const handleReadAloudResponse = async (message: string) => {
		console.log('Read aloud next message:', message);

		if (delayTime.current === 0) {
			await fy.start()
		}




		message = message.replace("burps", "");
		message = message.replace("burp", "");
		console.log(delayTime.current, "delayTime.current");

		// Add incremental delay before making TTS call
		try {
			let resultPromise = delay(delayTime.current).then(() => fy.makeTTS("TM:ebgxj0j4fvzp", message));

			// Push the Promise into the queue
			audioQueue.current.push(resultPromise.then(result => result.audioURL()));
		} catch (error) {
			if (error.message.includes('Rate limited')) {
				console.log("Hit rate limit, resending message in ", 1000, " milliseconds");
				setTimeout(() => handleReadAloudResponse(message), 1000);
				return;
			}
			throw error;
		}

		// Increase the delay by 1 second for each message
		delayTime.current += 5000;

		console.log('Promise added to queue', audioQueue.current.length);

		// Start playing audio after the first message
		if (!isPlaying.current) {
			isPlaying.current = true;
			playAudio();
		}
	};

	const playAudio = async () => {
		if (audioQueue.current.length > 0) {
			// Wait for the first Promise to resolve
			console.log('Waiting for the promise', audioQueue.current.length);

			let audio = new Audio(await audioQueue.current.shift());
			audio.onended = () => {
				console.log('Audio downloaded', audioQueue.current.length);
				playAudio(); // play the next audio when current one ends
			};
			console.log('Playing Audio');

			audio.play();
		} else {
			// If the queue is empty, set isPlaying to false
			console.log('Nothing to play, start recording: setActive(true)');
			isPlaying.current = false;
			delayTime.current = 0;
			voiceRecognition.current?.start()
			setActive(true);
		}
	};



	const handleRecognition = ({ value, isFinal }: VoiceRecognitionResults) => {
		value = value.trim()


		const textarea = document.querySelector('form textarea') as HTMLTextAreaElement
		if (value) {
			console.log('Recognition:', value);
			// console.log('Is Final:', isFinal);

			let sentences = textarea.value.split('\n')
			// console.log('sentences before', sentences);

			if (isFinal) {
				sentences[sentences.length - 1] = value
				sentences.push('')
			} else {
				sentences[sentences.length - 1] = value
			}
			// console.log('sentences after', sentences);
			sentences[sentences.length - 1] = value
			textarea.value = sentences.join('\n')


			if (value.toLowerCase().indexOf("rick") >= 0) {
				console.log('Start new input');

				textarea.value = ""
			}
			if (value.toLowerCase().indexOf("send") >= 0) {
				console.log('Sending message to GPT and stoping recording');

				(document.querySelector(buttonSelector) as any).click()
				voiceRecognition.current?.stop()
				setActive(false)
			}
			triggerEvent(textarea, 'input')
		}
	}

	const handleRecognictionClick = () => {
		console.log('handleRecognictionClick', active);

		if (!active) voiceRecognition.current.start();
		else voiceRecognition.current.stop();

		setActive(!active);
	}

	useEffect(() => {
		console.log('Initialize Read Aloud');

		if (isReadAloud) {
			MessagesObserver.initialize({ onResponse: handleReadAloudResponse })
			return () => {
				MessagesObserver.terminate()
				if (speechSynthesis.speaking) speechSynthesis.cancel()
				setIsReadAloud(false)
			}
		}
	}, [isReadAloud])


	useEffect(() => {
		console.log('setup recognition');

		voiceRecognition.current = new (window as any).webkitSpeechRecognition()
		voiceRecognition.current.lang = language
		voiceRecognition.current.continuous = true
		voiceRecognition.current.interimResults = true

		voiceRecognition.current.onresult = (event: any) => {
			const results = event.results[event.resultIndex]
			handleRecognition({ value: results[0].transcript, isFinal: results.isFinal })
		}

		return () => {
			voiceRecognition.current.stop();
			voiceRecognition.current.onresult = null;
			voiceRecognition.current = null;
		}

	}, [])


	return (
		<>

			<div
				title='Send message'
				onClick={e => (document.querySelector(buttonSelector) as any).click()}
				className='absolute bottom-1.5 right-10 md:bottom-2.5 md:right-11 cursor-pointer p-1 rounded-md text-gray-500 hover:bg-gray-100 dark:hover:text-gray-400 dark:hover:bg-gray-900 w-7 h-7 flex items-center justify-center'
			>
				<div className='w-5 h-5 flex items-center justify-center'><RxPaperPlane className='w-4 h-4' /></div>
			</div>
			<div className='inline group'>
				<div
					title={`Turn ${isReadAloud ? 'off' : 'on'} read aloud`}
					onClick={() => setIsReadAloud(!isReadAloud)}
					className={`cursor-pointer absolute z-10 rounded-md border border-gray-200 dark:border-white/10 w-6 h-6 flex items-center justify-center top-[-40px] right-0 ${isReadAloud ? 'bg-sky-500 text-white' : 'bg-gray-50 text-gray-600 dark:bg-white/10 dark:text-gray-200'}`}
				>
					{
						isReadAloud ? <TbVolume className='w-4 h-4' /> : <TbVolumeOff />
					}
				</div>

				<div
					title={active ? 'Listening...' : 'Voice control'}
					onClick={handleRecognictionClick}
					className={`absolute bottom-1.5 right-1 md:bottom-2.5 md:right-2 cursor-pointer rounded-md w-7 h-7 flex items-center justify-center ${active ? 'text-white bg-rose-500' : 'text-gray-500 hover:bg-gray-100 dark:hover:text-gray-400 dark:hover:bg-gray-900'}`}
				>
					<BiMicrophone className={`w-5 h-5 ${active ? 'animate-bounce mb-[-5px] text-white' : ''}`} />
				</div>

			</div>
		</>
	)
}

export default VoiceControl