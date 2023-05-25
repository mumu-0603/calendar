import {CSSProperties, useEffect, useState} from "react";
import {View} from '@tarojs/components';
import './index.scss'; // 引入外部样式表

interface Interface {
    /**
     * 周起始日-默认以日开始目前可选"日"起始和"一"起始视图默认为'日起始视图'
     */
    weekStartDay?: 0 | 1
    /**
     * 自定义标题样式
     */
    titleStyle?: CSSProperties
    /**
     * 自定义起始日class来达到自定义样式
     */
    weekClass?: string
    /**
     * 自定义日期格子class来达到自定义样式
     */
    timeClass?: string
    /**
     * 显示类型显示周还是显示
     */
    displayTyp?: 'month' | 'week'
    /**
     * 上一月或上一周
     */
    onPrevious?: () => void
    /**
     * 下一月或下一周
     */
    onNext?: () => void
    /**
     * 选中日期-默认选择今日
     */
    value?: string
    /**
     * 选中日期样式
     */
    selectedStyle?: CSSProperties
    /**
     * 选中日期事件
     */
    onSelectDate?: (e) => void
    /**
     * 日历显示类型切换事件
     */
    changeDisplayTyp?: () => void

}

const Calendar = (props: Interface) => {
    const [date, setDate] = useState(props.value ? new Date(props.value) : new Date());
    const [displayWeekdays, setDisplayWeekdays] = useState('日一二三四五六'); // 修改为默认为 "日一二三四五六"
    const [selectedDate, setSelectedDate] = useState(new Date(date.getFullYear(), date.getMonth(), date.getDate())); // 选中的日期
    const [displayTyp, setDisplayTyp] = useState<string>(props.displayTyp || 'month')
    console.log(displayTyp)
    // 切换周起始日
    useEffect(() => {
        if (props.weekStartDay) {
            setDisplayWeekdays((prevDisplay) => {
                return prevDisplay === '日一二三四五六' ? '一二三四五六日' : '日一二三四五六';
            });
        }
    }, [])

    const test = () => {
        if (displayTyp === 'month') setDisplayTyp('week')
        else setDisplayTyp('month')
    }

    // 切换到上一月
    const goToPreviousMonth = () => {
        setDate((prevDate) => new Date(prevDate.getFullYear(), prevDate.getMonth() - 1));
        props.onPrevious && props.onPrevious()
    };

    // 切换到下一月
    const goToNextMonth = () => {
        setDate((prevDate) => new Date(prevDate.getFullYear(), prevDate.getMonth() + 1));
        props.onNext && props.onNext()
    };

    // 切换到上一周
    const goToPreviousWeek = () => {
        setDate((prevDate) => {
            const newDate = new Date(prevDate);
            newDate.setDate(newDate.getDate() - 7);
            return newDate;
        });
        props.onPrevious && props.onPrevious()
    };

    // 切换到下一周
    const goToNextWeek = () => {
        setDate((prevDate) => {
            const newDate = new Date(prevDate);
            newDate.setDate(newDate.getDate() + 7);
            return newDate;
        });
        props.onNext && props.onNext()
    };

    // 获取当前月份的日期数组
    const getMonthDates = () => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDayOfMonth = new Date(year, month, 1);
        const startingDayOfWeek = firstDayOfMonth.getDay();
        const dates: any = [];
        const lastDayOfMonth = new Date(year, month + 1, 0);
        for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
            const currentDate = new Date(year, month, i);
            dates.push(currentDate);
        }
        const startingDayIndex = displayWeekdays.indexOf('日');
        let index = -1
        if (!startingDayIndex) {
            for (let i = 0; i < startingDayOfWeek - startingDayIndex; i++) {
                dates.unshift(new Date(year, month, 0 - i));
                index++
            }
            for (let i = dates.length; i < 45; i++) {
                if ((dates.length / 7) % 1 !== 0) {
                    dates.push(new Date(year, month, i - index))
                } else break
            }
        } else {
            for (let i = 1; i < startingDayOfWeek; i++) {
                dates.unshift(new Date(year, month, 0 - i));
            }
            for (let i = dates.length; i < 45; i++) {
                if ((dates.length / 7) % 1 !== 0) {
                    dates.push(new Date(year, month, i - index))
                } else break
            }
        }
        return dates;
    };

    // 获取当前周的日期数据
    const getWeekDates = () => {
        const startingDayOfWeek = date.getDay();
        const startingDate = new Date(date.getFullYear(), date.getMonth(), date.getDate() - (props?.weekStartDay ? (startingDayOfWeek ? startingDayOfWeek - 1 : 6) : startingDayOfWeek));
        const dates: any = [];
        for (let i = 0; i < 7; i++) {
            const date = new Date(startingDate.getFullYear(), startingDate.getMonth(), startingDate.getDate() + i);
            dates.push(date);
        }
        return dates;
    }

    // 获取周标题数组
    const getWeekdays = () => {
        return displayWeekdays.split('');
    };

    // 选中日期
    const selectDate = (selected) => {
        console.log((selected.getFullYear() + '年' + (selected.getMonth() + 1) + '月' + selected.getDate()))
        setSelectedDate(selected);
        setDate(selected);
        props.onSelectDate && props.onSelectDate(selected)
    };
    return (
        <View className={'l-calendar-main'}>
            <View className={'l-calendar-main-title'} style={props.titleStyle}>
                <View onClick={displayTyp === 'week' ? goToPreviousWeek : goToPreviousMonth}>{displayTyp === 'week' ? '上周' : '上一月'}</View>
                <View onClick={test}> {date.getFullYear() + '年' + (date.getMonth() + 1) + '月'}</View>
                <View onClick={displayTyp === 'week' ? goToNextWeek : goToNextMonth}>{displayTyp === 'week' ? '下周' : '下一月'}</View>
            </View>
            <View className={`calendar-grid`}>
                {
                    getWeekdays().map((weekday, index) => (
                        <View key={index} className={`calendar-weekday  ${props.weekClass}`}>{weekday}</View>
                    ))
                }
            </View>
            <View className="calendar-grid">
                {
                    (displayTyp === 'week' ? getWeekDates() : getMonthDates()).map((item, index) => (
                        <View key={index} className={`calendar-date ${item && selectedDate?.getTime() === item.getTime() ? 'selected' : ''} ${props.timeClass}`} onClick={() => selectDate(item)} style={selectedDate?.getTime() === item.getTime() ? props.selectedStyle : (displayTyp === 'month' ? {color: date.getMonth() + 1 !== item.getMonth() + 1 ? '#ccc' : ''} : {})}>
                            {item && (item.getDate() + '').padStart(2, "0")}
                        </View>
                    ))
                }
            </View>
        </View>
    );
};

export default Calendar;
