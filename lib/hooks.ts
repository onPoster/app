import { useEthers, Web3Ethers } from "@usedapp/core"
import { BytesLike, ethers, Wallet } from 'ethers';
import { JsonRpcProvider, StaticJsonRpcProvider, Web3Provider } from "@ethersproject/providers";
import { useState, useEffect, useCallback, useRef } from 'react';
import { POSTER_DEFAULT_NETWORK } from "../constants/poster";

/**
 * Is the private key valid
 * @internal
 * @param pk
 * @returns
 */
const isValidPk = (pk: BytesLike | undefined | null): boolean => {
  return pk?.length === 64 || pk?.length === 66;
};

/**
 * Save the current burner private key to storage
 * @internal
 * @param incomingPK
 */
const saveBurnerKeyToStorage = (incomingPK: BytesLike): void => {
  if (isValidPk(incomingPK)) {
    const rawPK = incomingPK;
    window.history.pushState({}, '', '/');
    const currentPrivateKey = window.localStorage.getItem('metaPrivateKey');
    if (currentPrivateKey && currentPrivateKey !== rawPK) {
      window.localStorage.setItem(`metaPrivateKey_backup${Date.now()}`, currentPrivateKey);
    }
    window.localStorage.setItem('metaPrivateKey', rawPK.toString());
  }
};

/**
 * Gets the current burner private key from storage
 * @internal
 * @returns
 */
const loadBurnerKeyFromStorage = (): string | null => {
  const currentPrivateKey = window.localStorage.getItem('metaPrivateKey');
  return currentPrivateKey;
};

/**
 * #### Summary
 * Return type of useBurnerSigner:
 *
 * ##### ✏️ Notes
 * - provides signer
 * - methods of interacting with burner signer
 * - methods to save and loadd signer from local storage
 *
 * @category Hooks
 */
export type TBurnerSigner = {
  signer: Wallet | undefined;
  account: string | undefined;
  /**
   * save to local storage
   */
  saveBurner: () => void;
  /**
   * load from local storage, or if it doesn't exist, create
   */
  loadOrGenerateBurner: () => void;
  /**
   * create a new burner signer
   */
  generateBurnerSigner: () => void;
  /**
   * get your current burner pk
   */
  getBurnerPrivateKey: () => BytesLike | undefined;
};

/**
 * #### Summary
 * A hook that creates a burner signer/address and provides ways of interacting with
 * and updating the signer
 *
 * @category Hooks
 *
 * @param localProvider localhost provider
 * @returns IBurnerSigner
 */
export const useBurnerSigner = (localProvider: JsonRpcProvider | Web3Provider | StaticJsonRpcProvider | undefined): TBurnerSigner => {
  const [privateKeyValue, setPrivateKey] = useState<BytesLike>();
  const walletRef = useRef<Wallet>();
  const creatingBurnerRef = useRef(false);
  const signer = walletRef.current;
  const account = walletRef.current?.address;
  const key = 'scaffold-eth-burner-privateKey';

  const setValue = (value: string): void => {
    try {
      setPrivateKey(value);
      window.localStorage.setItem(key, value);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const storedKey = window.localStorage.getItem(key);
    if (!storedKey) {
      const newWallet = ethers.Wallet.createRandom();
      const newKey = newWallet.privateKey;
      setValue(newKey);
    } else {
      setValue(storedKey);
    }
  }, []);

  useEffect(() => {
    if (privateKeyValue && localProvider) {
      const wallet = new ethers.Wallet(privateKeyValue);
      const newSigner = wallet.connect(localProvider);
      walletRef.current = newSigner;
    }
  }, [privateKeyValue, localProvider]);

  /**
   * if valid save burner key to storage
   */
  const saveToStorage = useCallback(() => {
    if (privateKeyValue != null) {
      saveBurnerKeyToStorage(privateKeyValue);
    }
  }, [privateKeyValue]);

  /**
   * create a new burnerkey
   */
  const generateBurnerSigner = useCallback(() => {
    if (localProvider && !creatingBurnerRef.current) {
      creatingBurnerRef.current = true;
      const wallet = Wallet.createRandom();
      setPrivateKey((_v) => {
        creatingBurnerRef.current = false;
        return wallet.privateKey;
      });
    } else {
      console.error('⚠ Could not create burner wallet');
    }
  }, [localProvider]);

  /**
   * Load burner key from storage
   */
  const loadOrGenerateBurner = useCallback(() => {
    if (setPrivateKey != null) {
      const pk = loadBurnerKeyFromStorage();
      if (pk && isValidPk(pk)) {
        setPrivateKey(pk);
      } else {
        generateBurnerSigner();
      }
    }
  }, [generateBurnerSigner]);

  const getBurnerPrivateKey = (): BytesLike | undefined => {
    return privateKeyValue;
  };

  return {
    signer,
    account,
    saveBurner: saveToStorage,
    loadOrGenerateBurner,
    generateBurnerSigner,
    getBurnerPrivateKey,
  };
};

export const useEthersWithFallback = (): Web3Ethers & { fallback: TBurnerSigner } => {
  const result = useEthers()
  const provider = result.library || new JsonRpcProvider(POSTER_DEFAULT_NETWORK)
  const fallback = useBurnerSigner(provider);
  return { ...result, fallback }
}