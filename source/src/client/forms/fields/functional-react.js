import React from 'react'
import {Input, Button, Checkbox, Dropdown} from 'semantic-ui-react'
import NumberInput from 'semantic-ui-react-numberinput'
import {optionsFromArray} from '../../utils'

// This module enables classes from semantic-ui-react etc. to be
// called as classes. Consider re-implementing as generalised webpack
// plugin or babel transpilation.


export const input = ({action, actionPosition, as, children, className, disabled, error, fluid, focus, icon, iconPosition, input, inverted, label, labelPosition, loading, onChange, placeholder, tabIndex, transparent, type, value}) => (
    <>
    <br/>
    <Input
        action={action}
        actionPosition={actionPosition}
        as={as}
        children={children}
        className={className}
        disabled={disabled}
        error={error}
        fluid
        focus={focus}
        icon={icon}
        iconPosition={iconPosition}
        input={input}
        inverted={inverted}
        label={label}
        labelPosition={labelPosition}
        loading={loading}
        placeholder={placeholder}
        onChange={onChange}
        tabIndex={tabIndex}
        transparent={transparent}
        type={type}
        value={value}/>
    </>
)
export const button = ({onChange, active, animated, as, attached, basic, children, circular, className, color, compact, content, disabled, floated, fluid, icon, inverted, label, labelPosition, loading, negative, onClick, positive, primary, role, secondary, size, tabIndex, toggle, value}) => (
    <Button
        active={active}
        animated={animated}
        as={as}
        attached={attached}
        basic={basic}
        children={children}
        circular={circular}
        className={className}
        color={color}
        compact={compact}
        content={content}
        disabled={disabled}
        floated={floated}
        fluid={fluid}
        icon={icon}
        inverted={inverted}
        label={label}
        labelPosition={labelPosition}
        loading={loading}
        negative={negative}
        onClick={onChange}
        positive={positive}
        primary={primary}
        role={role}
        secondary={secondary}
        size={size}
        tabIndex={tabIndex}
        toggle={toggle}
        value={value}/>
)
export const checkbox = ({as, checked, className, defaultChecked, defaultIndeterminate, disabled, fitted, id, indeterminate, label, name, onChange, onClick, onMouseDown, onMouseUp, radio, readOnly, slider, tabIndex, toggle, type, value}) => (
    <Checkbox
        as={as}
        checked={checked||value}
        className={className}
        defaultChecked={defaultChecked}
        defaultIndeterminate={defaultIndeterminate}
        disabled={disabled}
        fitted={fitted}
        id={id}
        indeterminate={indeterminate}
        label={label}
        name={name}
        onChange={() => onChange(undefined, {value : !value})}
        onClick={onClick}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        radio={radio}
        readOnly={readOnly}
        slider={slider}
        tabIndex={tabIndex}
        toggle={toggle}
        type={type}/>
    )
export const numberInput = ({placeholder, onChange, value, allowEmptyValue, buttonPlacement, id, className, defaultValue, doubleClickStepAmount, minValue, maxValue, maxLength, precision, showError, showTooltips, size, stepAmount, valueType}) => (
    <NumberInput
        onChange={value => onChange(undefined,{value})}
        value={value}
        allowEmptyValue={allowEmptyValue}
        buttonPlacement={buttonPlacement}
        id={id}
        className={className}
        defaultValue={defaultValue}
        doubleClickStepAmount={doubleClickStepAmount}
        minValue={minValue}
        maxValue={maxValue}
        maxLength={maxLength}
        precision={precision}
        showError={showError}
        showTooltips={showTooltips}
        size={size}
        stepAmount={stepAmount}
        valueType={valueType}
        placeholder={placeholder}
        />
)
export const dropdown = ({additionLabel, additionPosition, allowAdditions, as, basic, button, children, className, clearable, closeOnBlur, closeOnChange, closeOnEscape, compact, deburr, defaultOpen, defaultSearchQuery, defaultSelectedLabel, defaultUpward, defaultValue, direction, disabled, error, floating, fluid, header, icon, inline, item, labeled, lazyLoad, loading, minCharacters, multiple, noResultsMessage, onAddItem, onBlur, onChange, onClick, onClose, onFocus, onLabelClick, onMouseDown, onOpen, onSearchChange, open, openOnFocus, options, placeholder, pointing, renderLabel, scrolling, search, searchInput, searchQuery, selectOnBlur, selectOnNavigation, selectedLabel, selection, simple, tabIndex, text, trigger, upward, value, wrapSelection }) => (
    <Dropdown    
        additionLabel={additionLabel}
        additionPosition={additionPosition}
        allowAdditions={allowAdditions}
        as={as}
        basic={basic}
        button={button}
        children={children}
        className={className}
        clearable={clearable}
        closeOnBlur={closeOnBlur}
        closeOnChange={closeOnChange}
        closeOnEscape={closeOnEscape}
        compact={compact}
        deburr={deburr}
        defaultOpen={defaultOpen}
        defaultSearchQuery={defaultSearchQuery}
        defaultSelectedLabel={defaultSelectedLabel}
        defaultUpward={defaultUpward}
        defaultValue={defaultValue}
        direction={direction}
        disabled={disabled}
        error={error}
        floating={floating}
        fluid={fluid}
        header={header}
        icon={icon}
        inline={inline}
        item={item}
        labeled={labeled}
        lazyLoad={lazyLoad}
        loading={loading}
        minCharacters={minCharacters}
        multiple={multiple}
        noResultsMessage={noResultsMessage}
        onAddItem={onAddItem}
        onBlur={onBlur}
        onChange={onChange}
        onClick={onClick}
        onClose={onClose}
        onFocus={onFocus}
        onLabelClick={onLabelClick}
        onMouseDown={onMouseDown}
        onOpen={onOpen}
        onSearchChange={onSearchChange}
        open={open}
        openOnFocus={openOnFocus}
        options={optionsFromArray(options)}
        placeholder={placeholder}
        pointing={pointing}
        renderLabel={renderLabel}
        scrolling={scrolling}
        search={search}
        searchInput={searchInput}
        searchQuery={searchQuery}
        selectOnBlur={selectOnBlur}
        selectOnNavigation={selectOnNavigation}
        selectedLabel={selectedLabel}
        selection={selection}
        simple={simple}
        tabIndex={tabIndex}
        text={text}
        trigger={trigger}
        upward={upward}
        value={value}
        wrapSelection={wrapSelection} />
)