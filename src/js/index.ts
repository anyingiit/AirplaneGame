import * as PIXI from 'pixi.js';

class MyPIXI {
    private readonly app: PIXI.Application

    constructor(renderWidth: number, renderHeight: number) {
        this.app = new PIXI.Application()

        this.app.renderer = PIXI.autoDetectRenderer(renderWidth, renderHeight)// // 通过源码得知, 如果想要设置render size, 需要通过这种方式
    }

    public getApp(): PIXI.Application {
        return this.app
    }

    public getAppView(): HTMLCanvasElement {
        return this.app.view
    }

    public getAppStage(): PIXI.Container {
        return this.app.stage
    }

    public getAppTicker(): PIXI.ticker.Ticker {
        return this.app.ticker
    }

    public static createSpriteFromImage(path: string) {
        return PIXI.Sprite.fromImage(path)
    }

    public static createText(text: string): PIXI.Text {
        return new PIXI.Text(text)
    }

    public addChildToStage(child: PIXI.DisplayObject) {
        this.getAppStage().addChild(child)
    }

    public removeChildForStage(child: PIXI.DisplayObject) {
        this.getAppStage().removeChild(child)
    }

    public createSpriteAndAddToStage<T extends PIXI.Sprite>(newChild: T, setChildFunc?: (child: T) => void): T {
        if (setChildFunc) {
            setChildFunc(newChild)
        }
        this.addChildToStage(newChild)
        return newChild
    }
}

class MyPIXIApp {
    private readonly PIXI_PARAMS = {
        render: {
            width: 512,
            height: 768
        }
    }
    private readonly myPIXI: MyPIXI

    private gamePause: boolean

    private readonly bg: PIXI.Sprite
    private readonly plane: PIXI.Sprite
    private readonly pauseButton: PIXI.Sprite
    private readonly unPauseButton: PIXI.Sprite
    private readonly mask: PIXI.Sprite
    private readonly scoreText: PIXI.Text

    private fpsCount: number
    private readonly planeBullets: PIXI.Sprite[] = []
    private readonly enemyPlanes: PIXI.Sprite[] = []
    private nextCreateEnemyTiming: number = -1
    private bulletFireSpeedLevel: number = 0
    private readonly bulletFireSpeed: number[] = [60, 50, 40, 30, 20, 15, 5, 3, 1]
    private readonly expItems: PIXI.Sprite[] = []
    private nextCreateExpItemTiming: number = -1
    private score: number = 0
    private planeLevelTexture: PIXI.Texture[] = []


    constructor() {
        this.myPIXI = new MyPIXI(this.PIXI_PARAMS.render.width, this.PIXI_PARAMS.render.height)

        this.bg = this.myPIXI.createSpriteAndAddToStage(MyPIXI.createSpriteFromImage('assets/bg_01.png'), (child) => {
            child.width = 512
            child.height = 768
        })

        this.planeLevelTexture.push(PIXI.Texture.fromImage('assets/plane.png'))
        this.planeLevelTexture.push(PIXI.Texture.fromImage('assets/plane3.png'))
        this.planeLevelTexture.push(PIXI.Texture.fromImage('assets/plane4.png'))
        this.plane = this.myPIXI.createSpriteAndAddToStage(new PIXI.Sprite(this.planeLevelTexture[0]), (child) => {
            child.anchor.set(0.5, 0.5)

            child.x = this.bg.width / 2
            child.y = this.bg.height / 2
        })
        this.setPlaneToLevel1()

        this.pauseButton = this.myPIXI.createSpriteAndAddToStage(MyPIXI.createSpriteFromImage('assets/zanting.png'), (child) => {
            child.width = 50
            child.height = 51

            child.anchor.set(1, 1)

            child.x = this.bg.width
            child.y = this.bg.height
        })
        this.mask = MyPIXI.createSpriteFromImage('assets/mengban.png')
        const setMask = () => {
            this.mask.width = this.bg.width
            this.mask.height = this.bg.height

            this.mask.x = this.bg.x
            this.mask.y = this.bg.y

            this.mask.alpha = 0.8
        }
        setMask()

        this.unPauseButton = MyPIXI.createSpriteFromImage('assets/jixu.png')
        const setUnPauseButton = () => {
            this.unPauseButton.width = 172
            this.unPauseButton.height = 51

            this.unPauseButton.anchor.set(0.5, 0.5)

            this.unPauseButton.x = this.bg.width / 2
            this.unPauseButton.y = this.bg.height / 2
        }
        setUnPauseButton()

        this.scoreText = this.myPIXI.createSpriteAndAddToStage(MyPIXI.createText('init...' + this.score), (child) => {
            child.anchor.set(1, 0)

            child.position.set(this.bg.width, 0)
            child.style.fill = 'white'
        })
        this.flashScoreText()

        this.fpsCount = 0
        this.gamePause = false
        this.drawStage()
    }

    private initGameGlobalTicker() {
        this.myPIXI.getAppTicker().add(() => {
            if (this.gamePause) {// 如果状态为暂停就直接返回
                return
            }
            // 生成增强炮弹道具
            if (this.nextCreateExpItemTiming == -1) {
                // 当战机发射炮弹速度为最大时, 就不要生成下次生成炮弹增强道具的间隔时间了, 只要间隔时间一直为-1, 那么就不会生成道具了
                if (this.bulletFireSpeedLevel < this.bulletFireSpeed.length - 1) {
                    this.nextCreateExpItemTiming = Math.ceil((60 * 10) * Math.random())

                }
            } else {
                if (this.fpsCount % this.nextCreateExpItemTiming == 0) {
                    this.expItems.push(this.myPIXI.createSpriteAndAddToStage(MyPIXI.createSpriteFromImage('assets/exp.png'), (child) => {
                        child.anchor.set(0.5, 0.5)

                        child.width = 79
                        child.height = 52

                        child.position.set(this.bg.width * Math.random(), child.height * -1 - 20)
                    }))
                    this.nextCreateExpItemTiming = -1
                }
            }

            // 发射炮弹
            if (this.fpsCount % this.bulletFireSpeed[this.bulletFireSpeedLevel] == 0) { // 按照任务要求, 该处为每秒发射两发炮弹
                this.planeBullets.push(this.myPIXI.createSpriteAndAddToStage(MyPIXI.createSpriteFromImage('assets/bullet_1.png'), (child) => {
                    child.anchor.set(0.5, 0.5)

                    child.width = 50
                    child.height = 65

                    child.anchor.set(0.5, 0.5)
                    child.position.set(this.plane.x, this.plane.y)
                }))
            }
            // 当下次战机生成的时间间隔未确定的时候, 生成
            if (this.nextCreateEnemyTiming == -1) {
                this.nextCreateEnemyTiming = Math.ceil((60 * 5) * Math.random())
            } else {// 当已存在生成战机间隔存在, 并且现在就是生成战机的时机时, 生成战机
                if (this.fpsCount % this.nextCreateEnemyTiming == 0) {
                    const randomEnemyNumber = Math.ceil(3 * Math.random())// 最高同时生成3个, 最低1个, 向下取整
                    for (let i = 0; i < randomEnemyNumber; i++) {
                        this.enemyPlanes.push(this.myPIXI.createSpriteAndAddToStage(MyPIXI.createSpriteFromImage('assets/enemy_01.png'), (child) => {
                            child.anchor.set(0.5, 0.5)

                            child.width = 102
                            child.height = 77

                            // x:出现在屏幕外, 而且确保机身不会漏进屏幕
                            // y:随机x的位置
                            child.position.set(this.bg.width * Math.random(), (child.height * -1) - 20)
                        }))
                        this.nextCreateEnemyTiming = -1
                    }
                }
            }
            this.expItems.forEach((expItem) => {
                expItem.y += 4
            })
            // 每个敌机位置刷新
            this.enemyPlanes.forEach((enemy) => {
                enemy.y += 3
            })
            // 每发炮弹位置刷新
            this.planeBullets.forEach((bullet) => {
                bullet.y -= 5
            })
            // 摧毁超出屏幕的炮弹
            if (this.planeBullets.length > 0 && this.planeBullets[0].y < 0 - this.planeBullets[0].height) {
                const bullet = (this.planeBullets.shift() as PIXI.Sprite)
                bullet.destroy()
            }

            // 每发炮弹是否击中敌机状态监测
            for (let i = 0; i < this.planeBullets.length; i++) {
                for (let j = 0; j < this.enemyPlanes.length; j++) {
                    const a = this.planeBullets[i].y - this.enemyPlanes[j].y
                    const b = this.planeBullets[i].x - this.enemyPlanes[j].x
                    const c = Math.sqrt(a * a + b * b)

                    if (c <= this.enemyPlanes[j].width / 2 + this.planeBullets[i].height / 2) {
                        this.score += 100
                        this.flashScoreText()

                        this.enemyPlanes[j].destroy()
                        this.enemyPlanes.splice(j, 1)
                        this.planeBullets[i].destroy()
                        this.planeBullets.splice(i, 1)
                        i -= 1;
                        break
                    }
                }

            }

            // 检测我方战机是否撞击了敌机
            this.enemyPlanes.forEach((enemy) => {
                    const a = this.plane.y - enemy.y < 0 ? (this.plane.y - enemy.y) * -1 : this.plane.y - enemy.y
                    const b = this.plane.x - enemy.x < 0 ? (this.plane.x - enemy.x) * -1 : this.plane.x - enemy.x
                    const c = Math.sqrt(a * a + b * b)
                    // console.log(a, b, c)

                    // console.log('c:', c, 'test', this.plane.width / 2 + enemy.width / 2)
                    if (c <= this.plane.width / 2 + enemy.width / 2) {
                        this.pauseGame()
                        console.log('我方战机撞击了地方战机')
                    }
                }
            )
            // 当我方撞击增强炮弹道具时
            for (let i = 0; i < this.expItems.length; i++) {
                const a = this.plane.y - this.expItems[i].y < 0 ? (this.plane.y - this.expItems[i].y) * -1 : this.plane.y - this.expItems[i].y
                const b = this.plane.x - this.expItems[i].x < 0 ? (this.plane.x - this.expItems[i].x) * -1 : this.plane.x - this.expItems[i].x
                const c = Math.sqrt(a * a + b * b)

                if (c <= this.plane.width / 2 + this.expItems[i].width / 2) {
                    this.expItems[i].destroy()
                    this.expItems.splice(i, 1)
                    i -= 1
                    if (this.bulletFireSpeedLevel < this.bulletFireSpeed.length - 1) {
                        this.bulletFireSpeedLevel += 1


                        // 按照子弹等级改变战机样式
                        if (this.bulletFireSpeedLevel == 0) {
                            this.setPlaneToLevel1()
                        } else if (this.bulletFireSpeedLevel >= this.bulletFireSpeed.length / 2 && this.bulletFireSpeedLevel < this.bulletFireSpeed.length - 1) {
                            this.setPlaneToLevel2()
                        } else if (this.bulletFireSpeedLevel == this.bulletFireSpeed.length - 1) {
                            this.setPlaneToLevel3()
                        }
                    }
                }
            }

            // console.log(this.enemyPlanes)

            this.fpsCount += 1 // 刷新帧状态
        })
    }

    private drawStage() {
        this.initGameGlobalTicker()

        this.bg.interactive = true
        this.bg.on('mousemove', (even: PIXI.interaction.InteractionEvent) => {
            if (this.gamePause) {
                return
            }
            const position = even.data.getLocalPosition(this.bg)// 获取事件的本地位置, 事件是鼠标触发的, 相对于bg的x和y坐标
            if (position.x <= this.bg.width && position.y <= this.bg.height) {
                this.plane.position.set(position.x, position.y)
            }
        })

        this.pauseButton.interactive = true
        this.pauseButton.on('click', () => {
            this.pauseGame()
        })
        this.unPauseButton.interactive = true
        this.unPauseButton.on('click', () => {
            this.unPauseGame()
        })
    }

    private setPlaneToLevel1() {
        this.plane.texture = this.planeLevelTexture[0]

        this.plane.width = 117
        this.plane.height = 93
    }

    private setPlaneToLevel2() {
        this.plane.texture = this.planeLevelTexture[1]

        this.plane.width = 110
        this.plane.height = 85
    }

    private setPlaneToLevel3() {
        this.plane.texture = this.planeLevelTexture[2]

        this.plane.width = 114
        this.plane.height = 92
    }

    private flashScoreText() {
        this.scoreText.text = '分数: ' + this.score
    }

    private pauseGame() {
        this.gamePause = true

        this.myPIXI.addChildToStage(this.mask)
        this.myPIXI.addChildToStage(this.unPauseButton)
    }

    private unPauseGame() {
        this.myPIXI.removeChildForStage(this.unPauseButton)
        this.myPIXI.removeChildForStage(this.mask)

        this.gamePause = false
    }

    public getView() {
        return this.myPIXI.getAppView()
    }
}

class Index {
    private readonly document: Document
    private readonly myPIXIApp: MyPIXIApp


    constructor(document: Document) {
        this.document = document
        this.myPIXIApp = new MyPIXIApp()
    }

    public show() {
        this.document.body.appendChild(this.myPIXIApp.getView())
    }
}

const index = new Index(document)
index.show()