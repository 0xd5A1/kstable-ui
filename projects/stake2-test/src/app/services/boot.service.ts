import {
    ApplicationRef,
    Injectable
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import WalletConnectProvider from '@walletconnect/web3-provider';
import { BigNumber } from 'bignumber.js';
import { interval, Observable, Subject } from 'rxjs';
import { environment } from '../../environments/environment';
import LiquidityFarmingProxy from 'libs/abi/LiquidityFarmingProxy.json';
import ERC20 from 'libs/abi/ERC20.json';
import KSTToken from 'libs/abi/KSTToken.json';
import KStablePool from 'libs/abi/SmartSwapPool02.json';
import KSTMinter from 'libs/abi/KSTMinter.json';
import { ApproveDlgComponent } from '../approve-dlg/approve-dlg.component';
import { Balance } from '../model/balance';
import { PoolInfo } from '../model/pool-info';
import { UnsupportedNetworkComponent } from '../unsupported-network/unsupported-network.component';
import { WalletExceptionDlgComponent } from '../wallet-exception-dlg/wallet-exception-dlg.component';
import { LocalStorageService } from 'angular-web-storage';
import { ConstVal } from '../model/const-val';
import { ethers } from "ethers";
@Injectable({
    providedIn: 'root'
})
export class BootService {
    isProduction = environment.production;

    walletReady: Subject<any> = new Subject();
    initContractsCompleted: Subject<any> = new Subject();

    poolId = environment.poolId;
    coins = environment.coins;
    liquiditySymbol = environment.liquiditySymbol;
    tokenSymbol = environment.tokenSymbol;
    web3: ethers.providers.Web3Provider;
    binanceWeb3: ethers.providers.Web3Provider;
    metamaskWeb3: ethers.providers.Web3Provider;
    wcWeb3: ethers.providers.Web3Provider;
    accounts: string[] = new Array();
    // bianceChain: any;

    // isConnected: boolean = false;

    balance: Balance = new Balance(this.coins.length);


    poolInfo: PoolInfo = new PoolInfo(this.coins.length);

    // daiContract: Contract;
    // busdContract: Contract;
    // usdtContract: Contract;
    poolContract: ethers.Contract;

    poolAddress: string;

    proxyContract: ethers.Contract;

    tokenContract: ethers.Contract;

    minterContract: ethers.Contract;

    contracts: Array<ethers.Contract> = new Array();
    contractsAddress: Array<string> = new Array();

    chainConfig: any;
    unSupportedNetworkSubject: Subject<any> = new Subject();
    chainId: string;
    wcProvider: WalletConnectProvider;

    virtualPrice: BigNumber;

    //Obserable
    accountsChanged: Observable<any>;
    chainChanged: Observable<any>;
    connected: Observable<any>;
    disconnected: Observable<any>;

    approvalStatusChange: Subject<any> = new Subject();
    lpApprovalStatusChange: Subject<any> = new Subject();
    balanceChange: Subject<any> = new Subject();


    constructor(private dialog: MatDialog, private applicationRef: ApplicationRef, private localStorage: LocalStorageService) {
        this.balance.coinsBalance = new Array();
        this.poolInfo.coinsBalance = new Array();
        this.coins.forEach(e => {
            this.balance.coinsBalance.push(new BigNumber(0));
            this.poolInfo.coinsAdminFee.push(new BigNumber(0));
            this.poolInfo.coinsBalance.push(new BigNumber(0));
            this.poolInfo.coinsRealBalance.push(new BigNumber(0));
        });

        // this.initContractsCompleted.subscribe(() => {
        //     interval(1000 * 60).subscribe(num => { // 轮训刷新数据
        //         if (this.web3 && this.accounts && this.chainConfig && this.chainConfig.enabled) {
        //             this.loadData();
        //         }
        //     });
        // });
        if (this.isMetaMaskInstalled()) {
            // @ts-ignore
            this.metamaskWeb3 = new ethers.providers.Web3Provider(window.ethereum);
        }
        if (this.isBinanceInstalled()) {
            // @ts-ignore
            this.binanceWeb3 = new ethers.providers.Web3Provider(window.BinanceChain);
        }
        this.wcProvider = new WalletConnectProvider({
            // infuraId: "a1b8fe06fc1349b1b812bdb7b8f79465",
            rpc: {
                // @ts-ignore
                56: environment.rpc[56],
                // @ts-ignore
                97: environment.rpc[97],
            },
        });
    }
    isMetaMaskInstalled() {
        //@ts-ignore
        return window.ethereum && window.ethereum.isMetaMask;
    }
    isBinanceInstalled() {
        // @ts-ignore
        return window.BinanceChain ? true : false;
    }



    private initContracts(): Promise<any> {
        this.proxyContract = new ethers.Contract(this.chainConfig.contracts.proxy.address, LiquidityFarmingProxy.abi, this.web3);
        return this.proxyContract.getTokenAddress().then(tokenAddress => {
            if (tokenAddress) {
                this.tokenContract = new ethers.Contract(tokenAddress, KSTToken.abi, this.web3);
                this.tokenContract.minter().then(minterAddress => {
                    this.minterContract = new ethers.Contract(minterAddress, KSTMinter.abi, this.web3);
                });
            }
            return this.proxyContract.poolInfo(this.chainConfig.contracts.pid).then((res) => {
                this.contracts.splice(0, this.contracts.length);
                if (res && res.lpToken) {
                    this.poolAddress = res.lpToken;
                    this.poolContract = new ethers.Contract(this.poolAddress, KStablePool.abi, this.web3);
                    this.chainConfig.contracts.coins.forEach(r => {
                        let contract = new ethers.Contract(r, ERC20.abi, this.web3);
                        this.contracts.push(contract);
                        this.contractsAddress.push(r);
                    });
                }
            }).then(() => { // contract event listener
                this.contracts.forEach((contract, index) => {
                    let filter_0 = contract.filters.Approval(this.accounts[0], null, null);
                    contract.on(filter_0, (owner, spender, amount, event) => {
                        this.approvalStatusChange.next({ index: index, owner: owner, spender: spender, amount: amount });
                    });
                    let filter_1 = contract.filters.Transfer(this.accounts[0], null, null);
                    contract.on(filter_1, (from, to, amt) => {
                        this.loadVariable();
                        this.balanceChange.next();
                    });
                    let filter_2 = contract.filters.Transfer(null, this.accounts[0], null);
                    contract.on(filter_2, (from, to, amt) => {
                        this.loadVariable();
                        this.balanceChange.next();
                    });
                });
                let filter_0 = this.poolContract.filters.Approval(this.accounts[0], null, null);
                this.poolContract.on(filter_0, (owner, spender, amount, event) => {
                    this.lpApprovalStatusChange.next({ owner: owner, spender: spender, amount: amount });
                });
                // let filter_1 = this.poolContract.filters.Transfer(this.accounts[0], null, null);
                // this.poolContract.on(filter_1, (from, to, amt) => {
                //     this.loadVariable();
                // });
                // let filter_2 = this.poolContract.filters.Transfer(null, this.accounts[0], null);
                this.poolContract.on('Transfer', (from, to, amt) => {
                    this.loadVariable();
                    this.balanceChange.next();
                });
                this.tokenContract.on('Transfer', (from, to, amt) => {
                    this.loadVariable();
                    this.balanceChange.next();
                });
                this.initContractsCompleted.next();
                return true;
            }).catch(e => {
                console.log(e);
            });
        });
    }

    public async getPoolInfo(pid: number): Promise<any> {
        if (this.chainConfig && this.accounts && this.accounts.length > 0) {
            return this.proxyContract.poolInfo(pid).then((res) => {
                return res;
            });
        } else {
            return new Promise((resolve, reject) => {
                resolve(null);
            });
        }
    }

    public getNetworkInfo(provider: any, _chainId?: string): Promise<any> {
        let chainId;
        if (!_chainId) {
            return this.web3.getNetwork().then(network => {
                chainId = network.chainId;
                this.chainConfig = environment.chains[chainId];
                if (!this.chainConfig || !this.chainConfig.enabled) {
                    return { isSupported: false, chainId: chainId, config: this.chainConfig };
                } else {
                    return { isSupported: true, chainId: chainId, config: this.chainConfig };
                }
            });
        } else {
            chainId = _chainId;
            return new Promise((resolve, reject) => {
                this.chainConfig = environment.chains[chainId];
                if (!this.chainConfig || !this.chainConfig.enabled) {
                    resolve({ isSupported: false, chainId: chainId, config: this.chainConfig });
                } else {
                    resolve({ isSupported: true, chainId: chainId, config: this.chainConfig });
                }
            });
        }
    }

    private initProviderEvent(provider: any) {
        this.accountsChanged = new Observable((observer) => {
            provider.on("accountsChanged", async (accounts: string[]) => {
                observer.next(accounts);
            });
        });
        this.accountsChanged.subscribe(async (accounts: string[]) => {
            console.log('accounts: ' + accounts);
            if (accounts.length > 0) {
                this.accounts = accounts;
                this.loadData();
            } else {
                this.accounts = accounts;
                this.balance.clear();
            }
            this.applicationRef.tick();
        });

        this.chainChanged = new Observable((observer) => {
            provider.on("chainChanged", async (chainId: string) => {
                observer.next(chainId);
            });
        });
        this.chainChanged.subscribe(async (chainId: string) => {
            console.log('chainId: ' + chainId);
            chainId = String(chainId);
            let networkInfo = await this.getNetworkInfo(chainId);
            if (networkInfo.isSupported) {
                this.chainConfig = environment.chains[chainId];
                this.chainId = chainId;
                this.initContracts().then(() => {
                    this.loadData();
                });
            } else {
                if (!provider.isMetaMask) {
                    this.dialog.open(UnsupportedNetworkComponent, { data: { chainId: chainId } });
                    this.balance.clear();
                    this.poolInfo.clear();
                    // this.accounts = [];
                }
            }
            this.applicationRef.tick();
        });

        // Subscribe to session connection
        this.connected = new Observable((observer) => {
            provider.on("connect", () => {
                observer.next();
            });
        });
        this.connected.subscribe((info) => {
            console.log("connect!");
            console.log(info);
            this.applicationRef.tick();
        });

        // Subscribe to session disconnection
        this.disconnected = new Observable((observer) => {
            provider.on("disconnect", (code: number, reason: string) => {
                observer.next({ code: code, reason: reason });
            });
        });
        this.disconnected.subscribe((res: any) => {
            console.log('disconnect!');
            console.log(res);
            window.location.reload();
        });
    }

    /**
     * connect to wallet connect
     */
    public connectWC() {

        // Subscribe to session connection
        this.wcProvider.on("connect", async () => {
            console.log("WalletConnect connect");

        });
        // Subscribe to session disconnection
        this.wcProvider.on("disconnect", (code: number, reason: string) => {
            console.log(code, reason);
        });
        //  Enable session (triggers QR Code modal)
        this.wcProvider.enable().then(res => {
            console.log(res);
            if (res && res.length > 0) {
                this.accounts = res;
                this.wcWeb3 = new ethers.providers.Web3Provider(this.wcProvider);
                this.web3 = this.wcWeb3;
                this.initProviderEvent(this.wcProvider);
                this.getNetworkInfo(this.wcProvider).then(networkInfo => {
                    if (networkInfo.isSupported) {
                        this.chainConfig = networkInfo.config;
                        this.chainId = networkInfo.chainId;
                        this.walletReady.next();
                        this.initContracts().then(() => {
                            this.loadData();
                        });
                    } else {
                        this.dialog.open(UnsupportedNetworkComponent, { data: { chainId: networkInfo.chainId } });
                        return;
                    }
                });
            }
        }).catch(e => {
            // @ts-ignore
            // this.wcWeb3 = new Web3_1_2(this.wcProvider);
            // this.web3 = this.wcWeb3;
            window.location.reload();
            console.log(e);
        });

    }

    public connentMetaMask() {
        if (this.isMetaMaskInstalled()) {
            //@ts-ignore
            window.ethereum.request({ method: 'eth_requestAccounts', param: [] }).then(() => {
                // @ts-ignore
                this.metamaskWeb3 = new ethers.providers.Web3Provider(window.ethereum);
                this.web3 = this.metamaskWeb3;
                this.localStorage.set(ConstVal.KEY_WEB3_TYPE, "metamask");
                // @ts-ignore
                this.initProviderEvent(window.ethereum);
                // @ts-ignore
                this.getNetworkInfo(window.ethereum).then(networkInfo => {
                    if (!networkInfo.isSupported) {
                        this.dialog.open(UnsupportedNetworkComponent, { data: { chainId: networkInfo.chainId } });
                        return;
                    } else {
                        // @ts-ignore
                        window.ethereum.request({ method: 'eth_accounts', parma: [] }).then(accounts => {
                            this.accounts = accounts;
                            this.walletReady.next();
                            this.initContracts().then(() => {
                                this.loadData();
                            });
                        });
                    }
                });
            });
        }
    }

    public connectBinance() {
        if (this.isBinanceInstalled()) {
            // @ts-ignore
            window.BinanceChain.request({ method: 'eth_requestAccounts', param: [] }).then(() => {
                // @ts-ignore
                this.binanceWeb3 = new ethers.providers.Web3Provider(window.BinanceChain);
                this.web3 = this.binanceWeb3;
                this.localStorage.set(ConstVal.KEY_WEB3_TYPE, "binance");
                // @ts-ignore
                this.initProviderEvent(window.BinanceChain);
                // @ts-ignore
                this.getNetworkInfo(window.BinanceChain).then(networkInfo => {
                    if (!networkInfo.isSupported) {
                        this.dialog.open(UnsupportedNetworkComponent, { data: { chainId: networkInfo.chainId } });
                        return;
                    } else {
                        // @ts-ignore
                        window.BinanceChain.request({ method: 'eth_accounts', parma: [] }).then(accounts => {
                            this.accounts = accounts;
                            this.walletReady.next();
                            this.initContracts().then(() => {
                                this.loadData();
                            });
                        });
                    }
                });
            });
        }
    }

    private loadPoolTotalSupply(): Promise<BigNumber> {
        return this.poolContract.totalSupply({ from: this.accounts[0] }).then(totalSupplyStr => {
            this.poolInfo.totalSupply = new BigNumber(totalSupplyStr.toString()).div(new BigNumber(10).exponentiatedBy(18));
            return this.poolInfo.totalSupply;
        }).catch(e => {
            console.log(e);
        });
    }

    private loadPoolTotalSupplyVirtualPrice() {
        this.loadPoolTotalSupply().then(totalSupply => {
            if (totalSupply.comparedTo(0) > 0) {
                this.getVirtualPrice().then(virtualPrice => {
                    this.poolInfo.virtualPrice = new BigNumber(virtualPrice.toString());
                }).catch(e => {
                    console.log(e);
                });
            }
        });
    }

    private loadVariable() {
        this.loadPoolTotalSupplyVirtualPrice();
        this.loadPoolVolume();
        this.loadPendingReward();
        this.loadBalance();
    }

    private loadConstData() {
        let denominator = new BigNumber(10).exponentiatedBy(18);
        this.proxyContract.totalAllocPoint().then(points => {
            if (points) {
                this.poolInfo.totalAllocPoint = new BigNumber(points.toString()).div(denominator);
            }
        }).catch(e => {
            console.log(e);
        });
        this.minterContract.startBlock().then(startBlock => {
            this.poolInfo.startBlock = new BigNumber(startBlock.toString());
        });
        this.minterContract.tokenPerBlock().then(res => {
            this.poolInfo.tokenPerBlock = new BigNumber(res.toString()).div(denominator);
        });
        this.proxyContract.poolInfo(this.chainConfig.contracts.pid).then(res => {
            if (res && res.allocPoint) {
                this.poolInfo.allocPoint = new BigNumber(res.allocPoint.toString()).div(denominator);
            }
            if (res && res.accTokenPerShare) {
                this.poolInfo.accTokenPerShare = new BigNumber(res.accTokenPerShare.toString()).div(denominator);
            }
            if (res && res.shareRewardRate) {
                this.poolInfo.shareRewardRate = new BigNumber(res.shareRewardRate.toString()).div(denominator);
            }
            if (res && res.swapRewardRate) {
                this.poolInfo.swapRewardRate = new BigNumber(res.swapRewardRate.toString()).div(denominator);
            }
            if (res && res.totalVolAccPoints) {
                this.poolInfo.totalVolAccPoints = new BigNumber(res.totalVolAccPoints.toString()).div(denominator);
            }
            if (res && res.totalVolReward) {
                this.poolInfo.totalVolReward = new BigNumber(res.totalVolReward.toString()).div(denominator);
            }
            return true;
        });
        this.poolInfo.fee = new BigNumber(0.003);
        this.poolInfo.adminFee = new BigNumber(0.6666666667);
    }

    private loadPoolVolume() {
    }

    private loadPendingReward() {
        let denominator = new BigNumber(10).exponentiatedBy(18);
        this.proxyContract.pendingReward(this.chainConfig.contracts.pid, this.accounts[0], { from: this.accounts[0] }).then(pending => {
            if (pending) {
                this.balance.pendingToken = new BigNumber(pending.toString()).div(denominator);
            }
        }).catch(e => {
            console.log(e);
        });
    }

    private loadBalance() {
        let denominator = new BigNumber(10).exponentiatedBy(18);
        this.contracts.forEach((e, index) => {
            e.balanceOf(this.poolAddress, { from: this.accounts[0] }).then(pBalanceStr => {
                this.poolInfo.coinsBalance[index] = new BigNumber(pBalanceStr.toString()).div(new BigNumber(10).exponentiatedBy(18));
                this.poolContract.admin_balances(index, { from: this.accounts[0] }).then(adminBalanceStr => {
                    this.poolInfo.coinsRealBalance[index] = this.poolInfo.coinsBalance[index].minus(new BigNumber(adminBalanceStr.toString()).div(new BigNumber(10).exponentiatedBy(18)));
                }).catch(e => {
                    console.log(e);
                });
            }).catch(e => {
                console.log(e);
            });
        });
        this.tokenContract.balanceOf(this.accounts[0]).then(balance => {
            if (balance) {
                this.balance.tokenBalance = new BigNumber(balance.toString()).div(denominator);
            }
        });
        this.tokenContract.balanceOf(this.chainConfig.contracts.proxy.address).then(balance => {
            if (balance) {
                this.poolInfo.tokenBalance = new BigNumber(balance.toString()).div(denominator);
            }
        });
        this.tokenContract.totalSupply().then(totalSupply => {
            if (totalSupply) {
                this.poolInfo.tokenTotalSupply = new BigNumber(totalSupply.toString()).div(denominator);
            }
        });

        this.poolContract.balanceOf(this.accounts[0], { from: this.accounts[0] }).then(lpBalanceStr => {
            this.balance.lp = new BigNumber(lpBalanceStr.toString()).div(new BigNumber(10).exponentiatedBy(18));
        }).catch(e => {
            console.log(e);
        });

        this.poolContract.balanceOf(this.chainConfig.contracts.proxy.address, { from: this.accounts[0] }).then(totalLPStakingStr => {
            this.poolInfo.totalLPStaking = new BigNumber(totalLPStakingStr.toString()).div(denominator);
        }).catch(e => {
            console.log(e);
        });


        this.proxyContract.userInfo(this.chainConfig.contracts.pid, this.accounts[0], { from: this.accounts[0] }).then(res => {
            if (res && res.amount) {
                this.balance.stakingLP = new BigNumber(res.amount.toString()).div(denominator);
            }
            if (res && res.rewardDebt) {
                this.balance.rewardDebt = new BigNumber(res.rewardDebt.toString()).div(denominator);
            }
        }).catch(e => {
            console.log(e);
        });

        this.contracts.forEach((e, index) => {
            e.balanceOf(this.accounts[0], { from: this.accounts[0] }).then(balanceStr => {
                this.balance.coinsBalance[index] = new BigNumber(balanceStr.toString()).div(new BigNumber(10).exponentiatedBy(18));
            }).catch(e => {
                console.log(e);
            });
        });
    }
    public loadData() {
        this.loadConstData();
        this.loadVariable();
    }

    public approveLP(amt: string, address: string): Promise<any> {
        if (this.proxyContract) {
            let dialogRef = this.dialog.open(ApproveDlgComponent, { data: { amt: amt, symbol: this.liquiditySymbol } });
            return dialogRef.afterClosed().toPromise().then(async res => {
                let amt;
                if (res && res.continu && res.infinite === true) {
                    amt = new BigNumber(2).exponentiatedBy(256).minus(1).toFixed(0);
                } else if (res && res.continu && res.infinite === false) {
                    amt = res.amt;
                    amt = ethers.utils.parseEther(String(amt)).toString();
                } else {
                    return new Promise((resolve, reject) => {
                        resolve(false);
                    });
                }
                console.log(amt);
                return this.poolContract.estimateGas.approve(address, amt, { from: this.accounts[0] }).then(gas => {
                    let signer = this.web3.getSigner();
                    return this.poolContract.connect(signer).approve(address, amt, { from: this.accounts[0], gasLimit: gas.toString() });
                });
            });
        }
    }

    public async allowanceLP(address: string): Promise<BigNumber> {
        if (this.chainConfig && this.contracts && this.contracts.length > 0 && this.accounts && this.accounts.length > 0) {
            let decimals = await this.poolContract.decimals({ from: this.accounts[0] });
            return this.poolContract.allowance(this.accounts[0], address).then((res) => {
                return new BigNumber(res.toString()).div(new BigNumber(10).exponentiatedBy(decimals));
            });
        } else {
            return new Promise((resolve, reject) => {
                resolve(new BigNumber(0));
            });
        }

    }

    public async getVirtualPrice(): Promise<BigNumber> {
        if (this.chainConfig && this.contracts && this.contracts.length > 0 && this.accounts && this.accounts.length > 0) {
            return this.poolContract.get_virtual_price().then((res) => {
                let r = new BigNumber(res).div(new BigNumber(10).exponentiatedBy(18));
                if (r.comparedTo(999999) >= 0) {
                    return new BigNumber(0);
                } else {
                    return r;
                }
            });
        } else {
            return new Promise((resolve, reject) => {
                resolve(new BigNumber(0));
            });
        }
    }

    public depositLP(amt: string): Promise<any> {
        amt = ethers.utils.parseEther(String(amt)).toString();
        return this.proxyContract.estimateGas.deposit(this.chainConfig.contracts.pid, amt, { from: this.accounts[0] }).then(gas => {
            let signer = this.web3.getSigner();
            return this.proxyContract.connect(signer).deposit(this.chainConfig.contracts.pid, amt, { from: this.accounts[0], gasLimit: gas.toString() });
        }).catch(e => {
            console.log(e);
            throw e;
        });
    }

    public withdrawLP(amt: string): Promise<any> {
        amt = ethers.utils.parseEther(String(amt)).toString();
        return this.proxyContract.estimateGas.withdraw(this.chainConfig.contracts.pid, amt, { from: this.accounts[0] }).then(gas => {
            let signer = this.web3.getSigner();
            return this.proxyContract.connect(signer).withdraw(this.chainConfig.contracts.pid, amt, { from: this.accounts[0], gasLimit: gas.toString() });
        }).catch(e => {
            console.log(e);
            throw e;
        });
    }

    public async emergencyWithdraw(): Promise<any> {
        return this.proxyContract.estimateGas.emergencyWithdraw(this.chainConfig.contracts.pid, { from: this.accounts[0] }).then(gas => {
            let signer = this.web3.getSigner();
            return this.proxyContract.connect(signer).emergencyWithdraw(this.chainConfig.contracts.pid, { from: this.accounts[0], gasLimit: gas.toString() });
        }).catch(e => {
            console.log(e);
            throw e;
        });
    }

    public claimTestCoin(i: number): Promise<any> {
        return this.contracts[i].estimateGas.claimCoins({ from: this.accounts[0] }).then(gas => {
            let signer = this.web3.getSigner();
            return this.contracts[i].connect(signer).claimCoins({ from: this.accounts[0], gasLimit: gas.toString() });
        }).catch(e => {
            console.log(e);
        });
    }

    public isFarmingStart(): Promise<boolean> {
        if (this.web3 && this.proxyContract) {
            let pArr = new Array();
            pArr.push(this.web3.getBlock('latest'));
            pArr.push(this.minterContract.startBlock());
            return Promise.all(pArr).then(res => {
                if (res && res.length === 2) {
                    if (new BigNumber(res[0].number).comparedTo(res[1].toString()) >= 0) {
                        return true;
                    } else {
                        false;
                    }
                } else {
                    return new Promise((resolve, rejects) => {
                        return resolve(false);
                    });
                }
            });
        } else {
            return new Promise((resolve, rejects) => {
                return resolve(false);
            });
        }
    }
}
