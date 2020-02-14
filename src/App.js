import React from 'react';
import logo from './logo.svg';
import './App.css';

import {Navbar, Button, Alignment, Icon} from '@blueprintjs/core';


const {remote, desktopCapturer, shell} = global.window.require('electron');
const screen = remote.screen;

const os = global.window.require('os');
const path = global.window.require('path');
const fs = global.window.require('fs');
const win = remote.getCurrentWindow();


function App() {
  const onSnipClick = async () => {
    console.log('todo: making screenShot');
    
    try{
      win.hide();

      const screenSize = screen.getPrimaryDisplay().workAreaSize;
      const maxDimension = Math.max(screenSize.width, screenSize.height);
      console.log(screenSize.width, screenSize.height);

      const sources = await desktopCapturer.getSources(
        {
          types:
            [
              'screen', 'window'
            ],
          thumbnailSize: {width: maxDimension*window.devicePixelRatio, height: maxDimension*window.devicePixelRatio}
        }
      );
      const entireScreenSource = sources.find(source => source.name === 'Entire Screen' || "Screen 1");

      if(entireScreenSource){
        console.log(entireScreenSource);
        console.log(os.tmpdir());
        //const nativeImage = entireScreenSource.thumbnail;
        //const bufferPNG = nativeImage.toPNG();

        const bufferPNG = entireScreenSource.thumbnail
                    .resize({
                      width: screenSize.width,
                      height: screenSize.height
                    })
                    // .crop({
                    //   x: window.screenLeft,
                    //   y: window.screenTop,
                    //   width: window.innerWidth,
                    //   height: window.outerHeight
                    // })
                    .crop(win.getBounds())
                    .toPNG();        

        fs.writeFile(path.join(os.tmpdir(), 'screen.png'), bufferPNG, (err)=>{
          win.show();
          
          if(err) return console.log(err);
          console.log(path.join('file://', os.tmpdir(), 'screen.png'));
          shell.openItem(path.join('file://', os.tmpdir(), 'screen.png'));
        });
      }else{
        window.alert('DesktopCapturerSource object가 없음.')
      }
    }catch(err){
      console.log(err);
    }

  }
  // 어느 거나...
  // function onSnipClick(){
  //   console.log('todo: making screenShot');
  // }
  return (
    <div className="App">
      <Navbar>
        <Navbar.Group align={Alignment.LEFT}>
          <Navbar.Heading>Electron Snip</Navbar.Heading>
          <Navbar.Divider />
          <Button className="bp3-minimal" icon='settings' text='Settings' />
          <Button className='bp3-minimal' icon='help' text='About' />
          <Button className='bp3-minimal' icon='camera' text='Snip' onClick={onSnipClick}/>
        </Navbar.Group>
      </Navbar>  

      <main className='App-main'>
        <Icon icon='camera' iconSize={100} />
        <p>Electron Snip</p>
      </main>
    </div>
  );
}

export default App;
