import React, { useContext } from "react";
import { OptionContext, useAppContext } from "context";
import moment from "moment";
import { MyButton } from "components";
import { CouponDiscountTypeEnum } from "interfaces";

function CouponComponent() {
  const {
    options: { coupons },
  } = useContext(OptionContext);
  const {
    handler: { setSuccess },
  } = useAppContext();
  const handlerCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setSuccess("Coupon copied!");
  };
  return (
    <div className={"mt-4 flex flex-col gap-2"}>
      {coupons?.map((coupon, key) => {
        return (
          <div
            className={
              "rounded-md shadow-sm grid grid-cols-[150px_auto] gap-5 p-2 divide-x divide-gray-100 border border-gray-100 text-xs"
            }
          >
            <div className={"flex flex-col gap-2 items-center justify-center"}>
              <span className={"font-bold text-xl text-red-500 uppercase"}>
                {coupon?.discountType == CouponDiscountTypeEnum.FLAT && "Rs."}{" "}
                {coupon?.discount}{" "}
                {coupon?.discountType == CouponDiscountTypeEnum.PERCENTAGE &&
                  "%"}{" "}
                off
              </span>
              {coupon?.condition?.onlyOnFirstOrder ? (
                <span>On your first order</span>
              ) : coupon?.condition?.minimumSpendCondition > 0 ? (
                <span>
                  Min. spend Rs.{coupon?.condition?.minimumSpendCondition}
                </span>
              ) : (
                <></>
              )}
            </div>
            <div className={"flex flex-col justify-between pl-5"}>
              <span className={"text-lg font-medium"}>{coupon?.title}</span>
              <div className={"flex items-center justify-between"}>
                <span className={"text-gray-500"}>
                  Valid till {moment(coupon?.validUntil)?.format("DD/MM/YYYY")}
                </span>
                <div className="flex items-center border border-dashed border-gray-400 rounded-md p-2">
                  <span className=" font-mono mr-2 text-xs">
                    {coupon?.code}
                  </span>
                  <MyButton
                    onClick={() => handlerCopy(coupon?.code)}
                    color={"red"}
                    variant={"outlined"}
                    name={"Copy"}
                    size={"small"}
                  />
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default CouponComponent;
